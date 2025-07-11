const request = require("supertest");
const { createServer } = require("./server");

describe("API Endpoints", () => {
  let app, server, metricsInterval;

  beforeAll(async () => {
    ({ app, server, metricsInterval } = createServer());
    await new Promise((resolve) => server.listen(0, resolve));
  });

  afterAll(async () => {
    clearInterval(metricsInterval);
    await new Promise((resolve) => server.close(resolve));
    process.removeAllListeners("SIGTERM");
  });

  it("POST /api/generate-code should return a ZIP file", async () => {
    const response = await request(server)
      .post("/api/generate-code")
      .send({ prompt: "test" })
      .expect(200);
    expect(response.headers["content-type"]).toMatch(/zip/);
  }, 10000);
});
