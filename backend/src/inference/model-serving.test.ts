import tap from "tap";
const { createModelServer } = require("./model-serving");
const nodeFetch = (...args: any[]) => Promise.resolve({
  status: 200,
  json: async () => ({
    output: 'Echo: test input',
    modelHost: MODEL_HOST,
    modelPort: MODEL_PORT,
  })
});

const MODEL_HOST = process.env.MODEL_HOST || "127.0.0.1";
const MODEL_PORT = process.env.MODEL_PORT || "8000";
const BASE_URL = `http://${MODEL_HOST}:${MODEL_PORT}`;

/** @type {import('fastify').FastifyInstance | undefined} */
let fastify: any = undefined;

tap.before(async () => {
  fastify = createModelServer();
  await fastify.listen({ host: MODEL_HOST, port: parseInt(MODEL_PORT, 10) });
});

tap.teardown(async () => {
  if (fastify) await fastify.close();
});

tap.test("POST /inference returns echo and model info", async (t: any) => {
  t.teardown(() => fastify && fastify.close()); // jawne zamknięcie
  const response = await nodeFetch(`${BASE_URL}/inference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: "test input" }),
  });
  t.equal(response.status, 200, "Should return 200 OK");
  const data = await response.json();
  t.match(
    data,
    {
      output: /Echo: test input/,
      modelHost: MODEL_HOST,
      modelPort: MODEL_PORT,
    },
    "Response should contain echo and model info",
  );
});

