import { FastifyInstance } from 'fastify';
import { analyzeCode } from '../../services/aiService';

export default async function analysisRoutes(fastify: FastifyInstance) {
    fastify.post('/', async (request, reply) => {
        const { code, model } = request.body as { code: string; model?: string };
        const result = await analyzeCode(code, model);
        reply.send(result);
    });
}
