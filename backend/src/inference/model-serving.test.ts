import { buildServer } from "../server-fastify.cjs";

describe("Model Serving Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it("should respond to GET /inference with model info", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/inference",
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("model");
    expect(body).toHaveProperty("status");
  });

  it("should respond to POST /inference with completion", async () => {
    // You may need to adjust payload to match backend validation
    const response = await app.inject({
      method: "POST",
      url: "/inference",
      payload: {
        prompt: "console.",
        language: "javascript",
      },
    });
    expect([200, 201]).toContain(response.statusCode);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("completion");
  });
});

