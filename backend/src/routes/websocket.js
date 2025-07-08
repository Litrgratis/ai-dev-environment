const { CompletionService } = require('../services/completionService');
const jwt = require('jsonwebtoken');

class WebSocketHandler {
  constructor(fastify) {
    this.fastify = fastify;
    this.completionService = new CompletionService();
  }

  async setupWebSocket() {
    await this.fastify.register(require('@fastify/websocket'));

    // WebSocket endpoint with JWT authentication
    this.fastify.register(async (fastify) => {
      fastify.get('/ws/completion', { websocket: true }, async (connection, req) => {
        try {
          // JWT Authentication
          const token = req.headers.authorization?.replace('Bearer ', '');
          if (!token) {
            connection.socket.close(1008, 'Missing authorization token');
            return;
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;

          connection.socket.on('message', async (message) => {
            try {
              const data = JSON.parse(message.toString());
              const { context, language, requestId } = data;

              // Generate suggestions with latency <500ms target
              const startTime = Date.now();
              const result = await this.completionService.generateSuggestions(context, language);
              const latency = Date.now() - startTime;

              // Send response back
              connection.socket.send(JSON.stringify({
                requestId,
                suggestions: result.suggestions,
                fromCache: result.fromCache,
                latency,
                userId
              }));

              // Log metrics
              console.log(`[WS] User ${userId} - Language: ${language}, Latency: ${latency}ms, Cache: ${result.fromCache}`);

            } catch (error) {
              console.error('[WS] Error processing message:', error);
              connection.socket.send(JSON.stringify({
                error: 'Failed to process completion request',
                requestId: data?.requestId
              }));
            }
          });

          connection.socket.on('close', () => {
            console.log(`[WS] User ${userId} disconnected`);
          });

        } catch (authError) {
          console.error('[WS] Authentication failed:', authError);
          connection.socket.close(1008, 'Invalid token');
        }
      });
    });
  }
}

module.exports = { WebSocketHandler };
