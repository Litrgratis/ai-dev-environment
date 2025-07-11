jest.mock('openai', () => ({
  Configuration: jest.fn(),
  OpenAIApi: jest.fn(() => ({
    createChatCompletion: jest.fn().mockResolvedValue({
      data: { choices: [{ message: { content: 'mocked openai response' } }] }
    })
  }))
}));
const { LLMRouter } = require("../../src/llm/router");
describe("LLMRouter", () => {
  it("routes to Gemini", async () => {
    const router = new LLMRouter({
      geminiKey: "g",
      openaiKey: "o",
      ollamaUrl: "u",
    });
    router.gemini.generate = jest.fn().mockResolvedValue("gemini");
    const result = await router.generate("prompt", { provider: "gemini" });
    expect(result).toBe("gemini");
  });
  it("routes to OpenAI", async () => {
    const router = new LLMRouter({
      geminiKey: "g",
      openaiKey: "o",
      ollamaUrl: "u",
    });
    router.openai.generate = jest.fn().mockResolvedValue("openai");
    const result = await router.generate("prompt", { provider: "openai" });
    expect(result).toBe("openai");
  });
  it("routes to Ollama", async () => {
    const router = new LLMRouter({
      geminiKey: "g",
      openaiKey: "o",
      ollamaUrl: "u",
    });
    router.ollama.generate = jest.fn().mockResolvedValue("ollama");
    const result = await router.generate("prompt", { provider: "ollama" });
    expect(result).toBe("ollama");
  });
});
