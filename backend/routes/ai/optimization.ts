import { FastifyInstance } from "fastify";
import { optimizeCode } from "../../services/aiService";

export default async function optimizationRoutes(fastify: FastifyInstance) {
  fastify.post("/", async (request, reply) => {
    const { code, model } = request.body as { code: string; model?: string };
    const result = await optimizeCode(code, model);
    reply.send(result);
  });
}
