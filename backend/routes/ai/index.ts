import { FastifyInstance } from 'fastify';
import codeGenerationRoutes from './code-generation';
import analysisRoutes from './analysis';
import debuggingRoutes from './debugging';
import optimizationRoutes from './optimization';

export default async function aiRoutes(fastify: FastifyInstance) {
    fastify.register(codeGenerationRoutes, { prefix: '/code-generation' });
    fastify.register(analysisRoutes, { prefix: '/analysis' });
    fastify.register(debuggingRoutes, { prefix: '/debugging' });
    fastify.register(optimizationRoutes, { prefix: '/optimization' });
}
