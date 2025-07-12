const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

const aiRateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'ai_rate_limit:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many AI requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const heavyAIRateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'heavy_ai_rate_limit:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 heavy requests per hour
  message: {
    error: 'Too many heavy AI requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  aiRateLimiter,
  heavyAIRateLimiter
};
