const { GeminiLLM } = require('../../src/llm/gemini');
describe('GeminiLLM', () => {
  it('generates code from prompt', async () => {
    const llm = new GeminiLLM('test-key');
    llm.genAI = { getGenerativeModel: () => ({ generateContent: async () => ({ response: { text: () => 'code' } }) }) };
    const result = await llm.generate('test prompt');
    expect(result).toBe('code');
  });
});
