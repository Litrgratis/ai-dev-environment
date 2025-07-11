class GeminiLLM {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async generate(prompt) {
    return "code";
  }
  async analyze(code) {
    return { errors: [], score: 90 };
  }
}

module.exports = { GeminiLLM };
