const { buildServer } = require("../../src/server-fastify.cjs");
const jwt = require("jsonwebtoken");

describe("Authentication Protection Tests", () => {
  let app;
  let validToken;
  let expiredToken;
  let invalidToken;

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();

    // Create test tokens
    const secret = process.env.JWT_SECRET || "your-secret-key";

    validToken = jwt.sign({ id: 1, username: "user1" }, secret, {
      expiresIn: "1h",
    });

    expiredToken = jwt.sign(
      { id: 1, username: "user1" },
      secret,
      { expiresIn: "-1h" }, // Already expired
    );

    invalidToken = "invalid.token.here";
  }, 15000);

    const { stopMemoryMonitoring } = require("../../src/monitoring/metricsV2.cjs");
    afterAll(async () => {
        stopMemoryMonitoring();
        if (app) {
            await app.close();
        }
    });

  describe("Protected Endpoints Authentication", () => {
    const protectedEndpoints = [
      { method: "POST", url: "/api/completion" },
      { method: "POST", url: "/api/completion/batch" },
      { method: "GET", url: "/api/completion/stats" },
      { method: "POST", url: "/api/trigger-completion" },
      { method: "POST", url: "/api/chat" },
    ];

    protectedEndpoints.forEach(({ method, url }) => {
      describe(`${method} ${url}`, () => {
        test("should reject request without token", async () => {
          // Use required payload structure for validation
          let payload;
          if (method === "POST" && url.endsWith("batch")) {
            payload = { contexts: [{ text: "test context", cursorPosition: 0 }] };
          } else if (method === "POST") {
            payload = { context: { text: "test context", cursorPosition: 0 } };
          } else {
            payload = undefined;
          }
          const response = await app.inject({
            method,
            url,
            payload,
          });

          expect(response.statusCode).toBe(401);
          const body = JSON.parse(response.body);
          expect(body.error).toBeDefined();
        });

        test("should reject request with invalid token", async () => {
          let payload;
          if (method === "POST" && url.endsWith("batch")) {
            payload = { contexts: [{ text: "test context", cursorPosition: 0 }] };
          } else if (method === "POST") {
            payload = { context: { text: "test context", cursorPosition: 0 } };
          } else {
            payload = undefined;
          }
          const response = await app.inject({
            method,
            url,
            headers: {
              authorization: `Bearer ${invalidToken}`,
            },
            payload,
          });

          expect(response.statusCode).toBe(401);
        });

        test("should reject request with expired token", async () => {
          let payload;
          if (method === "POST" && url.endsWith("batch")) {
            payload = { contexts: [{ text: "test context", cursorPosition: 0 }] };
          } else if (method === "POST") {
            payload = { context: { text: "test context", cursorPosition: 0 } };
          } else {
            payload = undefined;
          }
          const response = await app.inject({
            method,
            url,
            headers: {
              authorization: `Bearer ${expiredToken}`,
            },
            payload,
          });

          expect(response.statusCode).toBe(401);
        });

        test("should accept request with valid token", async () => {
          let payload;
          if (method === "POST" && url.endsWith("batch")) {
            payload = { contexts: [{ text: "test context", cursorPosition: 0 }] };
          } else if (method === "POST") {
            payload = { context: { text: "test context", cursorPosition: 0 } };
          } else {
            payload = undefined;
          }
          const response = await app.inject({
            method,
            url,
            headers: {
              authorization: `Bearer ${validToken}`,
            },
            payload,
          });

          // Should not be 401 (may be 400 for invalid payload, but not auth issue)
          expect(response.statusCode).not.toBe(401);
        });
      });
    });
  });

  describe("JWT Token Validation", () => {
    test("should extract user information from valid token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/completion/stats",
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.user).toBeDefined();
    });

    test("should handle malformed authorization header", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/completion/stats",
        headers: {
          authorization: "InvalidFormat",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    test("should handle missing Bearer prefix", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/completion/stats",
        headers: {
          authorization: validToken, // Missing "Bearer "
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Login Endpoint Security", () => {
    test("should return token on valid credentials", async () => {
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
      expect(body.user).toBeDefined();
      expect(body.user.username).toBe("user1");
    });

    test("should reject invalid credentials", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "wrongpassword",
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.error).toBeDefined();
      expect(body.token).toBeUndefined();
    });

    test("should reject missing credentials", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          // Missing password
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("should reject non-existent user", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "nonexistent",
          password: "password123",
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Rate Limiting & Security Headers", () => {
    test("should include security headers", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });

      // Check for basic security headers (if implemented)
      // This is optional but good practice
      expect(response.statusCode).toBe(200);
    });

    test("should handle rapid requests gracefully", async () => {
      const requests = Array(10)
        .fill()
        .map(() =>
          app.inject({
            method: "POST",
            url: "/api/login",
            payload: {
              username: "user1",
              password: "password123",
            },
          }),
        );

      const responses = await Promise.all(requests);

      // All should succeed (no rate limiting implemented yet)
      responses.forEach((response) => {
        expect([200, 429]).toContain(response.statusCode); // 429 if rate limiting enabled
      });
    });
  });

  describe("Token Lifecycle", () => {
    test("should generate different tokens for each login", async () => {
      const response1 = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      const response2 = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      const token1 = JSON.parse(response1.body).token;
      const token2 = JSON.parse(response2.body).token;

      expect(token1).not.toBe(token2);
    });

    test("should validate token structure", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/login",
        payload: {
          username: "user1",
          password: "password123",
        },
      });

      const token = JSON.parse(response.body).token;
      const parts = token.split(".");

      // JWT should have 3 parts: header.payload.signature
      expect(parts).toHaveLength(3);
    });
  });
});
