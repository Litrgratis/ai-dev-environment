const { buildServer } = require("../../src/server-fastify.cjs");

describe("Dashboard API", () => {
  let fastify;

  beforeAll(async () => {
    fastify = await buildServer();
  });

    const { stopMemoryMonitoring } = require("../../src/monitoring/metricsV2.cjs");
    afterAll(async () => {
        stopMemoryMonitoring();
        await fastify.close();
    });

  it("GET /api/dashboard should return dashboard data", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/api/dashboard",
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("system");
    expect(payload).toHaveProperty("cache");
  });

  it("GET /api/dashboard/analytics should return analytics data", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/api/dashboard/analytics",
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("completions");
    expect(payload).toHaveProperty("latency");
  });

  it("GET /api/dashboard/llm-output should list files", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/api/dashboard/llm-output",
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(Array.isArray(payload)).toBe(true);
  });
});
