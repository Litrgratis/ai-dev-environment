export function securityHeadersMiddleware(req: any, res: any, next: Function) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // ...add more headers as needed...
    next();
}
