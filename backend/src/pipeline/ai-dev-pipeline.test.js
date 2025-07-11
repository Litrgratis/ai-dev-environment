const { CodeGenerator } = require("../core/generator");
const { CodeCritic } = require("../core/critic");
const { AIDevPipeline } = require("./ai-dev-pipeline");
const dotenv = require("dotenv");

dotenv.config();

describe("AIDevPipeline Generator-Critic Loop", () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const generator = new CodeGenerator(apiKey);
  const critic = new CodeCritic(apiKey);
  const pipeline = new AIDevPipeline(generator, critic);
  const prompt = "Write a function that adds two numbers.";
  const languages = ["javascript", "python", "java"];

  languages.forEach((lang) => {
    test(`Generator-Critic pipeline for ${lang}`, async () => {
      const result = await pipeline.run(prompt, lang, 3);
      expect(result.finalCode).toBeDefined();
      expect(result.iterations.length).toBeGreaterThan(0);
      result.iterations.forEach((it, idx) => {
        expect(it.code).toBeDefined();
        expect(it.feedback).toBeDefined();
        expect(it.iteration).toBe(idx + 1);
      });
    }, 10000); // 10s timeout
  });
});
