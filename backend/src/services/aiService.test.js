const AIService = require("../services/aiService");

describe("AIService (mocked LLM)", () => {
  let aiService;
  beforeAll(() => {
    process.env.GEMINI_API_KEY = "mock-key";
    aiService = new AIService();
  });

  it("parseGeneratedCode returns parsed JSON if valid", () => {
    const json =
      '{"files":{"main.js":"console.log(1)"},"dependencies":[],"description":"desc","setup_instructions":"setup"}';
    const result = aiService.parseGeneratedCode(json);
    expect(result.files["main.js"]).toContain("console.log(1)");
    expect(result.description).toBe("desc");
  });

  it("parseGeneratedCode returns fallback if not JSON", () => {
    const text = "not a json";
    const result = aiService.parseGeneratedCode(text);
    expect(result.files["main.js"]).toBe("not a json");
    expect(result.dependencies).toEqual([]);
  });

  it("buildEnhancedPrompt includes all options", () => {
    const prompt = "test";
    const options = {
      framework: "react",
      style: "modern",
      includeComments: true,
      language: "javascript",
    };
    const result = aiService.buildEnhancedPrompt(prompt, options);
    expect(result).toContain("Framework: react");
    expect(result).toContain("Programming Language: javascript");
    expect(result).toContain("Include Comments: Yes");
    expect(result).toContain("Project Requirements: test");
  });
});
