const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'ai-dev-environment'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics for AI Development Environment
const completionRequestsTotal = new client.Counter({
  name: 'completion_requests_total',
  help: 'Total number of completion requests',
  labelNames: ['language', 'user_id', 'from_cache'],
  registers: [register]
});

const completionLatency = new client.Histogram({
  name: 'completion_latency_seconds',
  help: 'Completion request latency in seconds',
  labelNames: ['language', 'from_cache'],
  buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register]
});

const redisOperations = new client.Counter({
  name: 'redis_operations_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation', 'status'],
  registers: [register]
});

const wsConnections = new client.Gauge({
  name: 'websocket_connections_active',
  help: 'Number of active WebSocket connections',
  registers: [register]
});

const wsMessages = new client.Counter({
  name: 'websocket_messages_total',
  help: 'Total number of WebSocket messages',
  labelNames: ['type', 'user_id'],
  registers: [register]
});

const geminiApiCalls = new client.Counter({
  name: 'gemini_api_calls_total',
  help: 'Total number of Gemini API calls',
  labelNames: ['model', 'status'],
  registers: [register]
});

const cacheHitRate = new client.Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage',
  registers: [register]
});

// Performance monitoring
const memoryUsage = new client.Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Node.js memory usage in bytes',
  labelNames: ['type'],
  registers: [register]
});

// Update memory metrics every 10 seconds
setInterval(() => {
  const mem = process.memoryUsage();
  memoryUsage.set({ type: 'rss' }, mem.rss);
  memoryUsage.set({ type: 'heapUsed' }, mem.heapUsed);
  memoryUsage.set({ type: 'heapTotal' }, mem.heapTotal);
  memoryUsage.set({ type: 'external' }, mem.external);
}, 10000);

// Cache statistics tracker
class CacheStats {
  constructor() {
    this.hits = 0;
    this.misses = 0;
  }

  recordHit() {
    this.hits++;
    this.updateHitRate();
  }

  recordMiss() {
    this.misses++;
    this.updateHitRate();
  }

  updateHitRate() {
    const total = this.hits + this.misses;
    if (total > 0) {
      cacheHitRate.set((this.hits / total) * 100);
    }
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
    cacheHitRate.set(0);
  }
}

const cacheStats = new CacheStats();

// Metrics helper functions
const metricsHelpers = {
  recordCompletionRequest: (language, userId, fromCache, latencyMs) => {
    completionRequestsTotal.inc({ 
      language, 
      user_id: userId, 
      from_cache: fromCache.toString() 
    });
    
    completionLatency.observe(
      { language, from_cache: fromCache.toString() }, 
      latencyMs / 1000
    );

    if (fromCache) {
      cacheStats.recordHit();
    } else {
      cacheStats.recordMiss();
    }
  },

  recordRedisOperation: (operation, status) => {
    redisOperations.inc({ operation, status });
  },

  recordWSConnection: (delta) => {
    wsConnections.inc(delta);
  },

  recordWSMessage: (type, userId) => {
    wsMessages.inc({ type, user_id: userId });
  },

  recordGeminiApiCall: (model, status) => {
    geminiApiCalls.inc({ model, status });
  },

  getMetrics: async () => {
    return await register.metrics();
  },

  getCacheStats: () => ({
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate: cacheStats.hits + cacheStats.misses > 0 ? 
      (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100 : 0
  })
};

// Performance profiler for monitoring latency targets
class PerformanceProfiler {
  constructor() {
    this.thresholds = {
      completion: 500, // ms
      cache: 50,       // ms
      websocket: 100   // ms
    };
  }

  async profile(operation, fn, ...args) {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - start;
      
      if (duration > this.thresholds[operation]) {
        console.warn(`⚠️  Performance warning: ${operation} took ${duration}ms (threshold: ${this.thresholds[operation]}ms)`);
      }

      return { result, duration };
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ Error in ${operation} after ${duration}ms:`, error.message);
      throw error;
    }
  }
}

const profiler = new PerformanceProfiler();

// Health check with detailed metrics
const getHealthStatus = () => {
  const mem = process.memoryUsage();
  const uptime = process.uptime();
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`
    },
    cache: metricsHelpers.getCacheStats(),
    version: process.env.npm_package_version || '1.0.0'
  };
};

module.exports = {
  register,
  metricsHelpers,
  profiler,
  getHealthStatus,
  cacheStats
};
