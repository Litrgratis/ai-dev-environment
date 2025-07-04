import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        reply.status(401).send({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        // Multi-factor check (example: check if MFA is required and verified)
        // Assume user object has mfaRequired and mfaVerified flags
        // (In real app, fetch user from DB)
        if ((payload as any).mfaRequired && !(payload as any).mfaVerified) {
            reply.status(403).send({ error: 'MFA required' });
            return;
        }
        (request as any).user = payload;
    } catch (err) {
        reply.status(401).send({ error: 'Invalid token' });
        return;
    }
}