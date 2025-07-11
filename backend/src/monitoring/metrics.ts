const client = require("prom-client");
const os = require("os");

// Create a Registry to register the metrics
const register = new client.Registry();

// Default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register });

// Custom metric example: AI requests counter
const aiRequests = new client.Counter({
  name: "ai_requests_total",
  help: "Total number of AI code generation requests",
});
register.registerMetric(aiRequests);

// Custom metric: Generator-Critic iterations counter
const generatorCriticCounter = new client.Counter({
  name: "generator_critic_iterations_total",
  help: "Total number of Generator-Critic iterations",
});
register.registerMetric(generatorCriticCounter);

// Custom metrics: System CPU and RAM usage
const systemCpu = new client.Gauge({
  name: "system_cpu_usage",
  help: "Current system CPU usage (%)",
});
register.registerMetric(systemCpu);

const systemRam = new client.Gauge({
  name: "system_ram_usage",
  help: "Current system RAM usage (%)",
});
register.registerMetric(systemRam);

// Update system metrics (CPU/RAM usage) every 5 seconds
function updateSystemMetrics() {
  const cpus = os.cpus();
  const cpuLoad =
    cpus.reduce(
      (acc, cpu) =>
        acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq,
      0,
    ) /
    (cpus.length * 100);
  systemCpu.set(cpuLoad);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  systemRam.set(((totalMem - freeMem) / totalMem) * 100);
}
setInterval(updateSystemMetrics, 5000);

function setupMetrics(app) {
  app.get("/api/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
}

module.exports = {
  register,
  aiRequests,
  generatorCriticCounter,
  systemCpu,
  systemRam,
  setupMetrics,
};
