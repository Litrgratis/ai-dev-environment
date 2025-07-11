const { buildServer } = require("../../src/server-fastify.cjs");
const { stopMemoryMonitoring } = require("../../src/monitoring/metricsV2.cjs");

describe("Completion API Tests", () => {
  let app;
  let authToken;

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();

    // Get auth token for tests
    const loginResponse = await app.inject({
      method: "POST",
      url: "/api/login",
      payload: {
        username: "user1",
        password: "password123",
      },
    });

    authToken = JSON.parse(loginResponse.body).token;
  }, 15000);

  afterAll(async () => {
    // Stop memory monitoring to prevent open handles
    stopMemoryMonitoring();

    if (app) {
      await app.close();
    }
  });

  describe("POST /api/completion", () => {
    test("should validate input data", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          // Missing context
          language: "javascript",
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain("context");
    });

    test("should require authentication", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        payload: {
          context: {
            text: "user.",
            cursorPosition: 5,
          },
        },
      });

      expect(response.statusCode).toBe(401);
    });

    test("should return completion suggestions", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          context: {
            text: "user.",
            cursorPosition: 5,
          },
          language: "javascript",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body.success).toBe(true);
      expect(Array.isArray(body.suggestions)).toBe(true);
      expect(body.suggestions.length).toBeGreaterThan(0);
      expect(body.metadata).toHaveProperty("latency");
      expect(body.metadata).toHaveProperty("requestId");
      expect(body.metadata.language).toBe("javascript");
    });

    test("should respect max suggestions limit", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          context: {
            text: "console.",
            cursorPosition: 8,
          },
          maxSuggestions: 3,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.suggestions.length).toBeLessThanOrEqual(3);
    });

    test("should handle large context gracefully", async () => {
      const largeText = "a".repeat(15000); // Exceed 10000 limit

      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          context: {
            text: largeText,
            cursorPosition: 100,
          },
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain(
        "must NOT have more than 10000 characters",
      );
    });

    test("should return fallback on service error", async () => {
      // Mock service error by passing invalid context
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          context: {
            text: null, // Invalid - should cause error
            cursorPosition: 0,
          },
        },
      });

      // Should still return 200 with fallback suggestions
      expect([200, 500]).toContain(response.statusCode);

      if (response.statusCode === 500) {
        const body = JSON.parse(response.body);
        expect(body.fallback).toBeDefined();
        expect(Array.isArray(body.fallback)).toBe(true);
      }
    });
  });

  describe("POST /api/completion/batch", () => {
    test("should handle multiple contexts", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/completion/batch",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          contexts: [
            { text: "user.", cursorPosition: 5 },
            { text: "console.", cursorPosition: 8 },
            { text: "Array.", cursorPosition: 6 },
          ],
          language: "javascript",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body.success).toBe(true);
      expect(Array.isArray(body.results)).toBe(true);
      expect(body.results).toHaveLength(3);

      body.results.forEach((result, index) => {
        expect(result.index).toBe(index);
        expect(result).toHaveProperty("success");
      });
    });

    test("should reject too many contexts", async () => {
      const contexts = Array(15)
        .fill()
        .map((_, i) => ({
          text: `item${i}.`,
          cursorPosition: 6,
        }));

      const response = await app.inject({
        method: "POST",
        url: "/api/completion/batch",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          contexts,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain("must NOT have more than 10 items");
    });
  });

  describe("GET /api/completion/stats", () => {
    test("should return completion statistics", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/completion/stats",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body.stats).toHaveProperty("totalRequests");
      expect(body.stats).toHaveProperty("cacheHitRate");
      expect(body.stats).toHaveProperty("supportedLanguages");
      expect(Array.isArray(body.stats.supportedLanguages)).toBe(true);
    });
  });

  describe("Performance Tests", () => {
    test("should meet latency requirements (<500ms)", async () => {
      const start = Date.now();

      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          context: {
            text: "function test() { return user.",
            cursorPosition: 32,
          },
        },
      });

      const latency = Date.now() - start;

      expect(response.statusCode).toBe(200);
      expect(latency).toBeLessThan(500);

      const body = JSON.parse(response.body);
      expect(body.metadata.latency).toBeLessThan(500);
    }, 10000);

    test("should handle concurrent requests", async () => {
      const requests = Array(5)
        .fill()
        .map(() =>
          app.inject({
            method: "POST",
            url: "/api/completion",
            headers: {
              authorization: `Bearer ${authToken}`,
            },
            payload: {
              context: {
                text: "const data = user.",
                cursorPosition: 18,
              },
            },
          }),
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
      });
    }, 15000);
  });
});
