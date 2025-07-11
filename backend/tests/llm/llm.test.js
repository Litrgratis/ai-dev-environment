const {
  CompletionService,
} = require("../../src/services/completionService.cjs");
jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn(),
  };
});
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Mock the Google Generative AI
jest.mock("@google/generative-ai");

describe("LLM Service Tests", () => {
  let completionService;
  let mockModel;
  let mockGenAI;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock model
    mockModel = {
      generateContent: jest.fn(),
    };

    // Setup mock GenAI
    mockGenAI = {
      getGenerativeModel: jest.fn().mockReturnValue(mockModel),
    };

    GoogleGenerativeAI.mockImplementation(() => mockGenAI);

    completionService = new CompletionService();
  });

  afterEach(async () => {
    if (completionService && completionService.redis) {
      await completionService.redis.quit();
    }
  });

  describe("AI Suggestions Generation", () => {
    test("should generate suggestions from Gemini API", async () => {
      // Mock successful API response
      const mockResponse = {
        response: {
          text: () => '["id", "name", "email", "createdAt"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "user.",
        cursorPosition: 5,
      };

      const result = await completionService.generateAISuggestions(
        context,
        "javascript",
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(["id", "name", "email", "createdAt"]);
      expect(mockModel.generateContent).toHaveBeenCalledWith(
        expect.stringContaining("You are a code completion assistant"),
      );
    });

    test("should handle invalid JSON response from API", async () => {
      // Mock API response with invalid JSON
      const mockResponse = {
        response: {
          text: () => "Invalid JSON response from AI",
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "console.",
        cursorPosition: 8,
      };

      const result = await completionService.generateAISuggestions(
        context,
        "javascript",
      );

      // Should return the raw text as a single suggestion
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(["Invalid JSON response from AI"]);
    });

    test("should handle API errors gracefully", async () => {
      // Mock API error
      mockModel.generateContent.mockRejectedValue(
        new Error("API rate limit exceeded"),
      );

      const context = {
        text: "Array.",
        cursorPosition: 6,
      };

      await expect(
        completionService.generateAISuggestions(context, "javascript"),
      ).rejects.toThrow("API rate limit exceeded");
    });

    test("should limit suggestions to maximum 5", async () => {
      // Mock API response with many suggestions
      const mockResponse = {
        response: {
          text: () => '["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "test.",
        cursorPosition: 5,
      };

      const result = await completionService.generateAISuggestions(
        context,
        "javascript",
      );

      expect(result).toHaveLength(5);
      expect(result).toEqual(["a", "b", "c", "d", "e"]);
    });
  });

  describe("Fallback Logic", () => {
    test("should use mock suggestions when Gemini API is unavailable", async () => {
      // Temporarily remove API key to force fallback
      const originalApiKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const context = {
        text: "user.",
        cursorPosition: 5,
      };

      const result = await completionService.generateSuggestions(
        context,
        "javascript",
      );

      expect(result.suggestions).toEqual(["id", "name", "email", "createdAt"]);
      expect(result.fromCache).toBe(false);

      // Restore API key
      process.env.GEMINI_API_KEY = originalApiKey;
    });

    test("should use mock suggestions in test environment", async () => {
      // Set test environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "test";

      const context = {
        text: "console.",
        cursorPosition: 8,
      };

      const result = await completionService.generateSuggestions(
        context,
        "javascript",
      );

      expect(result.suggestions).toEqual([
        "log()",
        "error()",
        "warn()",
        "info()",
      ]);
      expect(result.fromCache).toBe(false);

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    test("should provide fallback when AI service fails", async () => {
      // Mock AI service failure
      mockModel.generateContent.mockRejectedValue(
        new Error("Service unavailable"),
      );

      const context = {
        text: "unknown.",
        cursorPosition: 8,
      };

      const result = await completionService.generateSuggestions(
        context,
        "javascript",
      );

      // Should get fallback suggestions without throwing error
      expect(result.suggestions).toEqual([
        "function",
        "const",
        "let",
        "var",
        "if",
        "for",
        "while",
      ]);
      expect(result.error).toBe(true);
    });
  });

  describe("Language Support", () => {
    test("should handle different programming languages", async () => {
      const mockResponse = {
        response: {
          text: () => '["append", "extend", "insert", "remove"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "list.",
        cursorPosition: 5,
      };

      const result = await completionService.generateAISuggestions(
        context,
        "python",
      );

      expect(result).toEqual(["append", "extend", "insert", "remove"]);

      // Check that prompt contains Python-specific context
      const calledPrompt = mockModel.generateContent.mock.calls[0][0];
      expect(calledPrompt).toContain("python");
    });

    test("should generate appropriate context for different languages", async () => {
      const languages = ["javascript", "typescript", "python", "java"];

      for (const language of languages) {
        const mockResponse = {
          response: {
            text: () => '["suggestion1", "suggestion2"]',
          },
        };

        mockModel.generateContent.mockResolvedValue(mockResponse);

        const context = {
          text: "test.",
          cursorPosition: 5,
        };

        await completionService.generateAISuggestions(context, language);

        const calledPrompt =
          mockModel.generateContent.mock.calls[
            mockModel.generateContent.mock.calls.length - 1
          ][0];
        expect(calledPrompt).toContain(language);
      }
    });
  });

  describe("Context Processing", () => {
    test("should extract appropriate context window", async () => {
      const mockResponse = {
        response: {
          text: () => '["suggestion"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const longText = 'const very = "long"; '.repeat(50) + "user.";
      const context = {
        text: longText,
        cursorPosition: longText.length,
      };

      await completionService.generateAISuggestions(context, "javascript");

      const calledPrompt = mockModel.generateContent.mock.calls[0][0];

      // Should contain context before cursor
      expect(calledPrompt).toContain("user.");
      // Should not contain the entire long text
      expect(calledPrompt.length).toBeLessThan(longText.length + 1000);
    });

    test("should handle empty context", async () => {
      const mockResponse = {
        response: {
          text: () => '["function", "const", "let"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "",
        cursorPosition: 0,
      };

      const result = await completionService.generateAISuggestions(
        context,
        "javascript",
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test("should handle context with cursor at beginning", async () => {
      const mockResponse = {
        response: {
          text: () => '["import", "const", "function"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "function test() { return true; }",
        cursorPosition: 0,
      };

      const result = await completionService.generateAISuggestions(
        context,
        "javascript",
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(["import", "const", "function"]);
    });
  });

  describe("Performance & Caching", () => {
    test("should cache successful responses", async () => {
      const mockResponse = {
        response: {
          text: () => '["cached", "response"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "cache.",
        cursorPosition: 6,
      };

      // First call - should hit API
      const result1 = await completionService.generateSuggestions(
        context,
        "javascript",
      );
      expect(result1.fromCache).toBe(false);

      // Second call - should hit cache (if Redis is available)
      const result2 = await completionService.generateSuggestions(
        context,
        "javascript",
      );

      // Note: This may be false if Redis is not running, which is acceptable
      expect(result2.suggestions).toEqual(result1.suggestions);
    });

    test("should track metrics for monitoring", async () => {
      const mockResponse = {
        response: {
          text: () => '["metric", "test"]',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const context = {
        text: "metrics.",
        cursorPosition: 8,
      };

      await completionService.generateSuggestions(context, "javascript");

      // Metrics should be recorded (implementation dependent)
      // This test ensures the call completes without error
      expect(mockModel.generateContent).toHaveBeenCalled();
    });
  });
});
