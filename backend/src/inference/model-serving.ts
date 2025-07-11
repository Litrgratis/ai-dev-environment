import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

export function createModelServer() {
  const fastify = Fastify({ logger: true });
  const MODEL_HOST = process.env.MODEL_HOST || "127.0.0.1";
  const MODEL_PORT = process.env.MODEL_PORT || "8000";

  fastify.post("/inference", async (request, reply) => {
    try {
      const { input } = request.body as { input: string };
      // TODO: Integrate with actual model logic or microservice
      // Placeholder: echo input
      const result = {
        output: `Echo: ${input}`,
        modelHost: MODEL_HOST,
        modelPort: MODEL_PORT,
      };
      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Model inference failed" });
    }
  });

  return fastify;
}

if (require.main === module) {
  const fastify = createModelServer();
  const MODEL_HOST = process.env.MODEL_HOST || "127.0.0.1";
  const MODEL_PORT = process.env.MODEL_PORT || "8000";
  fastify
    .listen({ host: MODEL_HOST, port: parseInt(MODEL_PORT, 10) })
    .then(() => {
      fastify.log.info(
        `Model server running at http://${MODEL_HOST}:${MODEL_PORT}`,
      );
    })
    .catch((err) => {
      fastify.log.error(err);
      process.exit(1);
    });
}
