class OpenAILLM {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async generate(prompt, model = "gpt-3.5-turbo") {
    // Mocked response for tests and development
    return `Mocked OpenAI response for: ${prompt}`;
  }
}
module.exports = { OpenAILLM };
