class GeminiProvider {
  async generateCode(prompt, options) {
    return { code: 'Gemini mock', ...options };
  }
}
module.exports = { GeminiProvider };
