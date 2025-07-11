// Stub OllamaLLM for tests
class OllamaLLM {
  async generateContent(prompt) {
    return { response: { text: () => 'mocked ollama code' } };
  }
}
module.exports = { OllamaLLM };
