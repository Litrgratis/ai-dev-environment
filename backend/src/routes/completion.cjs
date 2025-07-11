const { CompletionService } = require("../services/completionService.cjs");
const { metricsHelpers } = require("../monitoring/metricsV2.cjs");

class CompletionController {
  constructor() {
    this.completionService = new CompletionService();
  }

  // Schema validation for completion requests
  static getCompletionSchema() {
    return {
      type: "object",
      required: ["context"],
      properties: {
        context: {
          type: "object",
          required: ["text", "cursorPosition"],
          properties: {
            text: { type: "string", maxLength: 10000 },
            cursorPosition: { type: "number", minimum: 0 },
            language: { type: "string", maxLength: 50 },
          },
        },
        language: {
          type: "string",
          enum: [
            "javascript",
            "typescript",
            "python",
            "java",
            "go",
            "rust",
            "cpp",
          ],
          default: "javascript",
        },
        maxSuggestions: {
          type: "number",
          minimum: 1,
          maximum: 10,
          default: 5,
        },
      },
    };
  }

  // Main completion handler
  async handleCompletion(request, reply) {
    const startTime = Date.now();
    const userId = request.user?.id || "anonymous";

    try {
      const {
        context,
        language = "javascript",
        maxSuggestions = 5,
      } = request.body;

      // Validate token limits (prevent abuse)
      if (context.text.length > 10000) {
        return reply.status(400).send({
          error: "Context too large",
          maxLength: 10000,
        });
      }

      // Generate completion suggestions
      const result = await this.completionService.generateSuggestions(
        context,
        language,
      );

      // Limit suggestions count
      const suggestions = result.suggestions.slice(0, maxSuggestions);
      const latency = Date.now() - startTime;

      // Record metrics
      metricsHelpers.recordCompletionRequest(
        language,
        userId,
        result.fromCache,
        latency,
      );

      // Success response
      return {
        success: true,
        suggestions,
        metadata: {
          language,
          fromCache: result.fromCache,
          latency,
          requestId: `comp_${Date.now()}_${userId}`,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const latency = Date.now() - startTime;

      // Log error for monitoring
      request.log.error("Completion error:", {
        error: error.message,
        userId,
        latency,
      });

      // Return graceful error
      return reply.status(500).send({
        success: false,
        error: "Completion service temporarily unavailable",
        fallback: ["function", "const", "let", "if", "for"], // Basic fallback
        metadata: {
          latency,
          requestId: `comp_error_${Date.now()}_${userId}`,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  // Batch completion for multiple contexts
  async handleBatchCompletion(request, reply) {
    const { contexts, language = "javascript" } = request.body;
    const userId = request.user?.id || "anonymous";

    if (!Array.isArray(contexts) || contexts.length > 10) {
      return reply.status(400).send({
        error: "Invalid contexts array (max 10 items)",
      });
    }

    try {
      const results = await Promise.all(
        contexts.map(async (context, index) => {
          try {
            const result = await this.completionService.generateSuggestions(
              context,
              language,
            );
            return {
              index,
              success: true,
              suggestions: result.suggestions.slice(0, 5),
              fromCache: result.fromCache,
            };
          } catch (error) {
            return {
              index,
              success: false,
              error: error.message,
              fallback: ["function", "const", "let"],
            };
          }
        }),
      );

      return {
        success: true,
        results,
        metadata: {
          userId,
          language,
          processedCount: contexts.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: "Batch completion failed",
      });
    }
  }

  // Get completion statistics
  async getCompletionStats(request, reply) {
    const userId = request.user?.id;

    return {
      user: userId,
      stats: {
        totalRequests:
          metricsHelpers.getCacheStats().hits +
          metricsHelpers.getCacheStats().misses,
        cacheHitRate: metricsHelpers.getCacheStats().hitRate,
        avgLatency: "~300ms", // Mock for now
        supportedLanguages: [
          "javascript",
          "typescript",
          "python",
          "java",
          "go",
          "rust",
          "cpp",
        ],
      },
    };
  }
}

module.exports = { CompletionController };
