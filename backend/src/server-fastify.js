const fastify = require('fastify')({ logger: true });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { WebSocketHandler } = require('./routes/websocket');
const { CompletionService } = require('./services/completionService');
require('dotenv').config();

async function buildServer() {
  // Register CORS
  await fastify.register(require('@fastify/cors'), {
    origin: true
  });

  // Register JWT
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  });

  // Simple in-memory users (replace with proper database in production)
  const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) }
  ];

  // Initialize services
  const completionService = new CompletionService();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };
  });

  // Authentication endpoint
  fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body;
    
    if (!username || !password) {
      return reply.status(400).send({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return reply.status(401).send({ error: 'Invalid username or password' });
    }

    const token = fastify.jwt.sign({ 
      id: user.id, 
      username: user.username 
    }, { expiresIn: '1h' });
    
    return { token };
  });

  // Authentication decorator
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Code completion endpoint (REST fallback)
  fastify.post('/api/completion', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { context, language = 'javascript' } = request.body;
      
      if (!context) {
        return reply.status(400).send({ error: 'Context is required' });
      }

      const startTime = Date.now();
      const result = await completionService.generateSuggestions(context, language);
      const latency = Date.now() - startTime;

      return {
        suggestions: result.suggestions,
        fromCache: result.fromCache,
        latency,
        language
      };
    } catch (error) {
      fastify.log.error('Error in completion endpoint:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // UI trigger endpoint - initiate code completion
  fastify.post('/api/trigger-completion', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { 
        fileContent, 
        cursorPosition, 
        language = 'javascript',
        includeContext = true 
      } = request.body;

      if (!fileContent || cursorPosition === undefined) {
        return reply.status(400).send({ 
          error: 'fileContent and cursorPosition are required' 
        });
      }

      // Extract context around cursor
      const contextWindow = 200; // characters before/after cursor
      const start = Math.max(0, cursorPosition - contextWindow);
      const end = Math.min(fileContent.length, cursorPosition + contextWindow);
      
      const context = {
        text: fileContent,
        cursorPosition,
        contextWindow: fileContent.substring(start, end),
        language
      };

      const startTime = Date.now();
      const result = await completionService.generateSuggestions(context, language);
      const latency = Date.now() - startTime;

      // Log metrics for monitoring
      fastify.log.info(`Completion request - User: ${request.user.id}, Language: ${language}, Latency: ${latency}ms, Cache: ${result.fromCache}`);

      return {
        requestId: `req_${Date.now()}_${request.user.id}`,
        suggestions: result.suggestions,
        fromCache: result.fromCache,
        latency,
        language,
        context: includeContext ? context.contextWindow : undefined
      };
    } catch (error) {
      fastify.log.error('Error in trigger-completion endpoint:', error);
      return reply.status(500).send({ error: 'Failed to generate completion' });
    }
  });

  // Chat endpoint (existing functionality)
  fastify.post('/api/chat', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const { message, model: modelName = 'gemini-pro', temperature = 0.7 } = request.body;
      
      if (!message) {
        return reply.status(400).send({ error: 'Message is required' });
      }

      const model = genAI.getGenerativeModel({ model: modelName, temperature });
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      
      return { response: text };
    } catch (error) {
      fastify.log.error('Error in chat endpoint:', error);
      return reply.status(500).send({ error: 'Failed to process chat message' });
    }
  });

  // Setup WebSocket handler
  const wsHandler = new WebSocketHandler(fastify);
  await wsHandler.setupWebSocket();

  return fastify;
}

// Create and start server
async function start() {
  try {
    const server = await buildServer();
    const PORT = process.env.PORT || 8000;
    
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 AI Development Environment Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/ws/completion`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  process.exit(0);
});

if (require.main === module) {
  start();
}

module.exports = { buildServer, start };
