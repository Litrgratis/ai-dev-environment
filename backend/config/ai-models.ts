export const aiModels = [
  {
    name: "gpt-4",
    endpoint: process.env.GPT4_ENDPOINT || "http://localhost:8001",
  },
  {
    name: "codex",
    endpoint: process.env.CODEX_ENDPOINT || "http://localhost:8002",
  },
  // ...add more models as needed
];
