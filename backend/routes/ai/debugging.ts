import { FastifyInstance } from 'fastify';
import { debugCode } from '../../services/aiService';

export default async function debuggingRoutes(fastify: FastifyInstance) {
    fastify.post('/', async (request, reply) => {
        const { code, model } = request.body as { code: string; model?: string };
        const result = await debugCode(code, model);
        reply.send(result);
    });
}
