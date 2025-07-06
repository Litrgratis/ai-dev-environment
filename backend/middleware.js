const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

class SecurityMiddleware {
  static setupSecurity(app) {
    // Helmet for security headers
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https://api.gemini.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
      max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use('/api/', limiter);

    // Strict rate limiting for AI endpoints
    const aiLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 10, // limit each IP to 10 AI requests per minute
      message: {
        error: 'Too many AI requests, please try again later.',
      },
    });

    app.use('/api/generate-code', aiLimiter);
    app.use('/api/chat', aiLimiter);
  }

  static validateLogin() {
    return [
      body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-50 characters long and contain only letters, numbers, and underscores'),
      body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    ];
  }

  static validateCodeGeneration() {
    return [
      body('prompt')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Prompt must be between 10 and 1000 characters'),
      body('framework')
        .optional()
        .isIn(['react', 'vue', 'angular', 'svelte', 'vanilla'])
        .withMessage('Invalid framework'),
      body('style')
        .optional()
        .isIn(['modern', 'minimal', 'enterprise'])
        .withMessage('Invalid style'),
      body('temperature')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('Temperature must be between 0 and 1'),
    ];
  }

  static validateChatMessage() {
    return [
      body('message')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Message must be between 1 and 500 characters'),
      body('model')
        .optional()
        .isIn(['gemini-pro', 'gemini-pro-vision'])
        .withMessage('Invalid model'),
      body('temperature')
        .optional()
        .isFloat({ min: 0, max: 1 })
        .withMessage('Temperature must be between 0 and 1'),
    ];
  }

  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }

  static sanitizeInput(req, res, next) {
    // Basic input sanitization
    const sanitize = (obj) => {
      if (typeof obj === 'string') {
        return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          obj[key] = sanitize(obj[key]);
        }
      }
      return obj;
    };

    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    
    next();
  }

  static auditLog(req, res, next) {
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
    };

    // Log sensitive operations
    if (req.url.includes('/api/generate-code') || req.url.includes('/api/chat')) {
      console.log('AUDIT LOG:', JSON.stringify(logData));
    }

    next();
  }
}

module.exports = SecurityMiddleware;
