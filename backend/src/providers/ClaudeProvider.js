class ClaudeProvider {
  async generateCode(prompt, options) {
    return { code: 'Claude mock', ...options };
  }
}
module.exports = { ClaudeProvider };
