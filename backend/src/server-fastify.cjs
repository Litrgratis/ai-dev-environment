const fastify = require('fastify')({ 
  logger: true,
  // Fastify 5.x compatibility
  disableRequestLogging: false,
  keepAliveTimeout: 30000
});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { WebSocketHandler } = require('./routes/websocket.cjs');
const { CompletionService } = require('./services/completionService.cjs');
const { DashboardService } = require('./services/dashboardService.cjs');
const { CompletionController } = require('./routes/completion.cjs');
const { dashboardRoutes } = require('./routes/dashboard.cjs');
require('dotenv').config();

const fastifyCors = require('@fastify/cors');
const fastifyJwt = require('@fastify/jwt');

async function buildServer() {
  // Register CORS (Fastify 5.x compatible)
  await fastify.register(fastifyCors.default || fastifyCors, {
    origin: true,
    credentials: true
  });

  // Register JWT (Fastify 5.x compatible)  
  await fastify.register(fastifyJwt.default || fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    sign: {
      expiresIn: '1h'
    }
  });

  // Simple in-memory users (replace with proper database in production)
  const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) }
  ];

  // Initialize services
  const completionService = new CompletionService();
  const dashboardService = new DashboardService();
  const completionController = new CompletionController();
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

  // Authentication endpoint (Fastify 5.x compatible)
  fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body;
    
    if (!username || !password) {
      return reply.status(400).send({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return reply.status(401).send({ error: 'Invalid username or password' });
    }

    // Fastify 5.x JWT signing
    const token = fastify.jwt.sign({ 
      id: user.id, 
      username: user.username 
    });
    
    return { token, user: { id: user.id, username: user.username } };
  });

  // Authentication decorator (Fastify 5.x compatible)
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: 'Authentication failed', message: err.message });
    }
  });

  // Enhanced completion endpoints with schema validation
  fastify.post('/api/completion', {
    preHandler: [fastify.authenticate],
    schema: {
      body: CompletionController.getCompletionSchema()
    }
  }, async (request, reply) => {
    return await completionController.handleCompletion(request, reply);
  });

  // Batch completion endpoint
  fastify.post('/api/completion/batch', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['contexts'],
        properties: {
          contexts: {
            type: 'array',
            maxItems: 10,
            items: {
              type: 'object',
              required: ['text', 'cursorPosition'],
              properties: {
                text: { type: 'string', maxLength: 5000 },
                cursorPosition: { type: 'number', minimum: 0 }
              }
            }
          },
          language: { 
            type: 'string', 
            enum: ['javascript', 'typescript', 'python', 'java'],
            default: 'javascript'
          }
        }
      }
    }
  }, async (request, reply) => {
    return await completionController.handleBatchCompletion(request, reply);
  });

  // Completion statistics
  fastify.get('/api/completion/stats', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    return await completionController.getCompletionStats(request, reply);
  });

  // Dashboard routes
  fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });

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

  // Dashboard endpoints (migrated from Flask)
  fastify.get('/dashboard', async (request, reply) => {
    try {
      const files = await dashboardService.listFiles();
      const html = dashboardService.generateHTML(files);
      reply.type('text/html').send(html);
    } catch (error) {
      fastify.log.error('Dashboard error:', error);
      return reply.status(500).send({ error: 'Dashboard unavailable' });
    }
  });

  fastify.get('/api/dashboard/files', async (request, reply) => {
    try {
      const files = await dashboardService.listFiles();
      return { files };
    } catch (error) {
      fastify.log.error('Dashboard files error:', error);
      return reply.status(500).send({ error: 'Failed to list files' });
    }
  });

  fastify.get('/api/dashboard/file/:filename', async (request, reply) => {
    try {
      const { filename } = request.params;
      const content = await dashboardService.readFile(filename);
      const stats = await dashboardService.getFileStats(filename);
      
      reply.type('text/plain').send(content);
    } catch (error) {
      fastify.log.error('File read error:', error);
      return reply.status(404).send({ error: 'File not found' });
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
