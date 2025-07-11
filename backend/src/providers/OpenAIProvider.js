class OpenAIProvider {
  async generateCode(prompt, options) {
    return { code: 'OpenAI mock', ...options };
  }
}
module.exports = { OpenAIProvider };
