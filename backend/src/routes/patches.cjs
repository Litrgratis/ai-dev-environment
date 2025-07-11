const patchService = require("../services/patchService.cjs");

async function routes(fastify, options) {
  fastify.post(
    "/patches",
    {
      schema: {
        body: {
          type: "object",
          required: ["originalCode", "instruction"],
          properties: {
            originalCode: { type: "string" },
            instruction: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { originalCode, instruction } = request.body;
      try {
        const result = await patchService.generatePatch(
          originalCode,
          instruction,
        );
        reply.send(result);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Failed to generate patch" });
      }
    },
  );
}

module.exports = routes;
