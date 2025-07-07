class LLMRouter {
  constructor() {
    this.gemini = { generate: async () => 'gemini' };
    this.openai = { generate: async () => 'openai' };
    this.ollama = { generate: async () => 'ollama' };
  }
  async generate(prompt, { provider }) {
    return this[provider].generate();
  }
}

module.exports = { LLMRouter };
