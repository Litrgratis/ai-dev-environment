const Redis = require("ioredis");
const { buildServer } = require("../../src/server-fastify.cjs");
const { stopMemoryMonitoring } = require('../../src/monitoring/metricsV2.cjs');

describe("Environment Connectivity Tests - Fastify 5.x", () => {
  let app;
  let redis;

  beforeAll(async () => {
    jest.mock("ioredis", () => ({
      __esModule: true,
      default: require("ioredis-mock"),
      Redis: require("ioredis-mock"),
    }));
    // Initialize Redis connection
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    // Initialize Fastify 5.x server
    app = await buildServer();
    await app.ready();
  }, 15000); // Increased timeout for Docker startup

  afterAll(async () => {
    // Stop monitoring intervals
    stopMemoryMonitoring();

    // Graceful shutdown
    if (redis) {
      await redis.quit();
    }
    if (app) {
      await app.close();
    }
  }, 10000);

  describe("Redis Connectivity", () => {
    test("should connect to Redis successfully", async () => {
      await expect(redis.ping()).resolves.toBe("PONG");
    });

    test("should set and get values from Redis", async () => {
      const testKey = "test:connectivity";
      const testValue = "connection-test-" + Date.now();

      await redis.set(testKey, testValue);
      const result = await redis.get(testKey);

      expect(result).toBe(testValue);

      // Cleanup
      await redis.del(testKey);
    });

    test("should handle Redis cache operations", async () => {
      const cacheKey = "completion:javascript:test";
      const mockSuggestions = ["console.log", "function", "const"];

      // Test cache set
      await redis.setex(cacheKey, 60, JSON.stringify(mockSuggestions));

      // Test cache get
      const cached = await redis.get(cacheKey);
      const parsedSuggestions = JSON.parse(cached);

      expect(parsedSuggestions).toEqual(mockSuggestions);

      // Cleanup
      await redis.del(cacheKey);
    });
  });

  describe("Fastify Server Connectivity", () => {
    test("should start Fastify server", async () => {
      expect(app).toBeDefined();
      expect(app.server).toBeDefined();
    });

    test("should respond to health check", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe("healthy");
      expect(body.uptime).toBeGreaterThan(0);
    });

    test("should handle authentication endpoint", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.token).toBeDefined();
    });

    test("should protect completion endpoint with auth", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        payload: {
          context: { text: "user.", cursorPosition: 5 },
          language: "javascript",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    test("should provide completion with valid auth", async () => {
      // First get auth token
      const authResponse = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      const { token } = JSON.parse(authResponse.body);

      // Then test completion endpoint
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          context: { text: "user.", cursorPosition: 5 },
          language: "javascript",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.suggestions).toBeDefined();
      expect(Array.isArray(body.suggestions)).toBe(true);
      expect(body.latency).toBeDefined();
      expect(body.fromCache).toBeDefined();
    });
  });

  describe("Dashboard Integration", () => {
    test("should serve dashboard without auth", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/dashboard",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("text/html");
      expect(response.body).toContain("AI Development Environment Dashboard");
    });

    test("should list dashboard files", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/dashboard/files",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.files).toBeDefined();
      expect(Array.isArray(body.files)).toBe(true);
    });
  });

  describe("Performance & Memory Tests", () => {
    test("should handle multiple concurrent requests", async () => {
      // Get auth token first
      const authResponse = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      const { token } = JSON.parse(authResponse.body);

      // Create multiple concurrent requests
      const requests = Array.from({ length: 10 }, () =>
        app.inject({
          method: "POST",
          url: "/api/completion",
          headers: {
            authorization: `Bearer ${token}`,
          },
          payload: {
            context: { text: "console.", cursorPosition: 8 },
            language: "javascript",
          },
        }),
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
      });

      // Check memory usage hasn't exploded
      const memUsage = process.memoryUsage();
      expect(memUsage.heapUsed).toBeLessThan(100 * 1024 * 1024); // < 100MB
    });

    test("should meet latency requirements", async () => {
      const authResponse = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      const { token } = JSON.parse(authResponse.body);

      const start = Date.now();
      const response = await app.inject({
        method: "POST",
        url: "/api/completion",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          context: { text: "Array.", cursorPosition: 6 },
          language: "javascript",
        },
      });

      const latency = Date.now() - start;

      expect(response.statusCode).toBe(200);
      expect(latency).toBeLessThan(500); // < 500ms requirement

      const body = JSON.parse(response.body);
      expect(body.latency).toBeLessThan(500);
    });
  });
});
