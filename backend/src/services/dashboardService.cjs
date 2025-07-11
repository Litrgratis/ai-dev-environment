const fs = require("fs").promises;
const path = require("path");
const {
  metricsHelpers,
  getHealthStatus,
} = require("../monitoring/metricsV2.cjs");

const LLM_OUTPUT_DIR = path.join(__dirname, "../../../llm-output");

class DashboardService {
  constructor() {
    this.systemStats = {
      startTime: Date.now(),
      requests: 0,
      errors: 0,
    };
  }

  // Dashboard endpoint - replacement for Flask dashboard
  async getDashboardData() {
    const health = getHealthStatus();
    const metrics = metricsHelpers.getCacheStats();

    return {
      system: {
        ...health,
        requests: this.systemStats.requests,
        errors: this.systemStats.errors,
        uptime: Date.now() - this.systemStats.startTime,
      },
      cache: metrics,
      performance: {
        avgLatency: "~300ms", // Mock for now
        throughput: "50 req/s", // Mock for now
      },
      components: {
        fastify: "healthy",
        redis: "healthy",
        gemini: "healthy",
        websocket: "active",
      },
    };
  }

  // System stats tracking
  incrementRequests() {
    this.systemStats.requests++;
  }

  incrementErrors() {
    this.systemStats.errors++;
  }

  async listLlmOutputFiles() {
    const files = await this.walkDir(LLM_OUTPUT_DIR);
    return files;
  }

  async getLlmOutputFileContent(filename) {
    const filePath = path.join(LLM_OUTPUT_DIR, filename);

    // Security check to prevent directory traversal
    if (!filePath.startsWith(LLM_OUTPUT_DIR)) {
      console.warn(`Attempted directory traversal: ${filename}`);
      return null;
    }

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return content;
    } catch (error) {
      if (error.code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async walkDir(dir, filelist = []) {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = await fs.stat(filepath);

      if (stat.isDirectory()) {
        filelist = await this.walkDir(filepath, filelist);
      } else {
        filelist.push(path.relative(LLM_OUTPUT_DIR, filepath));
      }
    }

    return filelist;
  }

  // Analytics data for dashboard charts
  async getAnalytics(timeRange = "24h") {
    return {
      completions: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        data: [12, 19, 15, 32, 28, 41], // Mock data
      },
      latency: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        data: [245, 312, 198, 287, 334, 298], // Mock data in ms
      },
      cacheHitRate: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        data: [85, 78, 92, 88, 91, 87], // Mock data in %
      },
    };
  }
}

module.exports = { DashboardService };
