import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
  // Dodaj walidację i sanitizację inputów tutaj
  (req: Request, res: Response, next: NextFunction) => {
    // ...input validation/sanitization...
    next();
  },
];
