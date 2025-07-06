export const microservices = {
    executionService: process.env.EXEC_SERVICE_URL || 'http://localhost:9001',
    aiOrchestrator: process.env.AI_ORCH_URL || 'http://localhost:9002',
    securityGateway: process.env.SEC_GATEWAY_URL || 'http://localhost:9003',
};
