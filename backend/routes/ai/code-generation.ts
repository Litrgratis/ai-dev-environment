import { FastifyInstance } from 'fastify';
import { generateCodeWithModel } from '../../services/aiService';

export default async function codeGenerationRoutes(fastify: FastifyInstance) {
    fastify.post('/', async (request, reply) => {
        const { prompt, model } = request.body as { prompt: string; model: string };
        const result = await generateCodeWithModel(prompt, model);
        reply.send(result);
    });
}
