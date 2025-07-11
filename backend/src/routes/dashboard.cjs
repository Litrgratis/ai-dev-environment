const { DashboardService } = require("../services/dashboardService.cjs");

class DashboardController {
  constructor() {
    this.dashboardService = new DashboardService();
    // Binding methods to ensure 'this' context is correct
    this.getDashboardData = this.getDashboardData.bind(this);
    this.getAnalytics = this.getAnalytics.bind(this);
    this.listLlmOutput = this.listLlmOutput.bind(this);
    this.viewLlmOutputFile = this.viewLlmOutputFile.bind(this);
  }

  async getDashboardData(req, reply) {
    try {
      const data = await this.dashboardService.getDashboardData();
      reply.send(data);
    } catch (error) {
      req.log.error("Error fetching dashboard data:", error);
      reply.status(500).send({ error: "Failed to fetch dashboard data" });
    }
  }

  async getAnalytics(req, reply) {
    try {
      const data = await this.dashboardService.getAnalytics(
        req.query.timeRange,
      );
      reply.send(data);
    } catch (error) {
      req.log.error("Error fetching analytics data:", error);
      reply.status(500).send({ error: "Failed to fetch analytics data" });
    }
  }

  async listLlmOutput(req, reply) {
    try {
      const files = await this.dashboardService.listLlmOutputFiles();
      reply.send(files);
    } catch (error) {
      req.log.error("Error listing LLM output files:", error);
      reply.status(500).send({ error: "Failed to list LLM output files" });
    }
  }

  async viewLlmOutputFile(req, reply) {
    try {
      const { filename } = req.params;
      const content =
        await this.dashboardService.getLlmOutputFileContent(filename);
      if (content === null) {
        return reply.status(404).send({ error: "File not found" });
      }
      // For security, we'll return the content as JSON.
      // The frontend can then decide how to render it.
      reply.send({ filename, content });
    } catch (error) {
      req.log.error(
        `Error viewing LLM output file ${req.params.filename}:`,
        error,
      );
      reply.status(500).send({ error: "Failed to view LLM output file" });
    }
  }
}

async function dashboardRoutes(fastify, options) {
  const dashboardController = new DashboardController();

  fastify.get("/", dashboardController.getDashboardData);
  fastify.get("/analytics", dashboardController.getAnalytics);
  fastify.get("/llm-output", dashboardController.listLlmOutput);
  fastify.get(
    "/llm-output/view/:filename",
    dashboardController.viewLlmOutputFile,
  );
}

module.exports = { dashboardRoutes, DashboardController };
