const Redis = require("ioredis");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { metricsHelpers, profiler } = require("../monitoring/metricsV2.cjs");

class CompletionService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more predictable code completion
        maxOutputTokens: 256,
      },
    });

    // Test Redis connection (only if .on exists)
    if (typeof this.redis.on === "function") {
      this.redis.on("connect", () => {
        console.log("✅ Redis connected successfully");
        metricsHelpers.recordRedisOperation("connect", "success");
      });

      this.redis.on("error", (err) => {
        console.error("❌ Redis connection error:", err.message);
        metricsHelpers.recordRedisOperation("connect", "error");
      });
    }
  }

  // Cache key structure: lang:hash(context)
  getCacheKey(language, context) {
    const crypto = require("crypto");
    // Ensure context is a string for hashing
    const contextStr =
      typeof context === "string" ? context : JSON.stringify(context);
    const contextHash = crypto
      .createHash("md5")
      .update(contextStr)
      .digest("hex");
    return `completion:${language}:${contextHash}`;
  }

  async getCachedSuggestions(language, context) {
    try {
      const { result: cached } = await profiler.profile("cache", async () => {
        const key = this.getCacheKey(language, context);
        const data = await this.redis.get(key);
        metricsHelpers.recordRedisOperation("get", data ? "hit" : "miss");
        return data ? JSON.parse(data) : null;
      });
      return cached;
    } catch (error) {
      console.error("Cache get error:", error);
      metricsHelpers.recordRedisOperation("get", "error");
      return null;
    }
  }

  async cacheSuggestions(language, context, suggestions) {
    try {
      await profiler.profile("cache", async () => {
        const key = this.getCacheKey(language, context);
        // TTL=60s, LFU policy
        await this.redis.setex(key, 60, JSON.stringify(suggestions));
        metricsHelpers.recordRedisOperation("set", "success");
      });
    } catch (error) {
      console.error("Cache set error:", error);
      metricsHelpers.recordRedisOperation("set", "error");
    }
  }

  async generateSuggestions(context, language = "javascript") {
    try {
      // Check cache first
      const cached = await this.getCachedSuggestions(
        language,
        context.text || context,
      );
      if (cached) {
        return { suggestions: cached, fromCache: true };
      }

      // Generate with AI or fallback to mock
      let suggestions;

      if (process.env.GEMINI_API_KEY && process.env.NODE_ENV !== "test") {
        suggestions = await this.generateAISuggestions(context, language);
      } else {
        suggestions = this.generateMockSuggestions(context, language);
      }

      // Cache the results
      await this.cacheSuggestions(
        language,
        context.text || context,
        suggestions,
      );

      return { suggestions, fromCache: false };
    } catch (error) {
      console.error("Error generating suggestions:", error);
      // Fallback to mock suggestions on error
      const mockSuggestions = this.generateMockSuggestions(context, language);
      return { suggestions: mockSuggestions, fromCache: false, error: true };
    }
  }

  async generateAISuggestions(context, language) {
    try {
      const { result: suggestions } = await profiler.profile(
        "completion",
        async () => {
          const { text: contextText, cursorPosition, contextWindow } = context;
          const beforeCursor = contextText
            ? contextText.substring(0, cursorPosition)
            : contextWindow;

          const prompt = `You are a code completion assistant. Provide concise, relevant code completions for ${language}.

Context before cursor:
\`\`\`${language}
${beforeCursor}
\`\`\`

Return ONLY a JSON array of completion suggestions (max 5), each suggestion should be a string with the exact text to insert at the cursor position. No explanations, no markdown, just the raw completion text.

Example format: ["function", "const ", "if (", "return ", "console.log("]`;

          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const responseText = response.text().trim();

          metricsHelpers.recordGeminiApiCall("gemini-pro", "success");

          try {
            // Parse AI response
            const parsed = JSON.parse(responseText);
            return Array.isArray(parsed) ? parsed.slice(0, 5) : [responseText];
          } catch (parseError) {
            // If JSON parsing fails, return the raw text as a single suggestion
            return [responseText];
          }
        },
      );

      return suggestions;
    } catch (error) {
      console.error("AI suggestion error:", error);
      metricsHelpers.recordGeminiApiCall("gemini-pro", "error");
      throw error;
    }
  }

  generateMockSuggestions(context, language) {
    const { text, cursorPosition } = context;
    const beforeCursor = text.substring(0, cursorPosition);

    // Basic completion patterns
    if (beforeCursor.endsWith("user.")) {
      return ["id", "name", "email", "createdAt"];
    }
    if (beforeCursor.endsWith("console.")) {
      return ["log()", "error()", "warn()", "info()"];
    }
    if (beforeCursor.endsWith("Array.")) {
      return ["from()", "isArray()", "of()"];
    }

    return ["function", "const", "let", "var", "if", "for", "while"];
  }
}

module.exports = { CompletionService };
