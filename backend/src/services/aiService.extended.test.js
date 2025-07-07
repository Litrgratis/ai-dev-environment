const AIService = require('../services/aiService');

describe('AIService (mocked LLM) - extended', () => {
  let aiService;
  beforeAll(() => {
    process.env.GEMINI_API_KEY = 'mock-key';
    aiService = new AIService();
  });

  it('returns fallback for empty prompt', () => {
    const result = aiService.parseGeneratedCode('');
    expect(result.files['main.js']).toBe('');
  });

  it('buildEnhancedPrompt handles missing options', () => {
    const prompt = 'test';
    const result = aiService.buildEnhancedPrompt(prompt, {});
    expect(result).toContain('Project Requirements: test');
  });

  it('parseGeneratedCode handles nested files', () => {
    const json = '{"files":{"main.js":"code","utils/helper.js":"help"},"dependencies":[],"description":"desc","setup_instructions":"setup"}';
    const result = aiService.parseGeneratedCode(json);
    expect(result.files['utils/helper.js']).toBe('help');
  });

  it('parseGeneratedCode always returns setup_instructions', () => {
    const text = 'not a json';
    const result = aiService.parseGeneratedCode(text);
    expect(result.setup_instructions).toBeDefined();
  });

  it('buildEnhancedPrompt includes temperature and style', () => {
    const prompt = 'test';
    const options = { style: 'modern', temperature: 0.5 };
    const result = aiService.buildEnhancedPrompt(prompt, options);
    expect(result).toContain('Code Style: modern');
  });

  it('parseGeneratedCode returns valid JSON for valid input', () => {
    const json = '{"files":{"main.js":"console.log(1)"},"dependencies":[],"description":"desc","setup_instructions":"setup"}';
    const result = aiService.parseGeneratedCode(json);
    expect(result.description).toBe('desc');
  });

  it('parseGeneratedCode returns fallback for invalid JSON', () => {
    const text = 'invalid json';
    const result = aiService.parseGeneratedCode(text);
    expect(result.files['main.js']).toBe('invalid json');
  });

  it('buildEnhancedPrompt includes language', () => {
    const prompt = 'test';
    const options = { language: 'python' };
    const result = aiService.buildEnhancedPrompt(prompt, options);
    expect(result).toContain('Programming Language: python');
  });

  it('parseGeneratedCode returns empty dependencies if not present', () => {
    const text = 'not a json';
    const result = aiService.parseGeneratedCode(text);
    expect(Array.isArray(result.dependencies)).toBe(true);
  });

  it('parseGeneratedCode returns default description if not present', () => {
    const text = 'not a json';
    const result = aiService.parseGeneratedCode(text);
    expect(result.description).toBe('Generated code');
  });

  it('parseGeneratedCode returns default setup_instructions if not present', () => {
    const text = 'not a json';
    const result = aiService.parseGeneratedCode(text);
    expect(result.setup_instructions).toBe('No specific setup instructions provided');
  });

  it('buildEnhancedPrompt includes Include Comments', () => {
    const prompt = 'test';
    const options = { includeComments: false };
    const result = aiService.buildEnhancedPrompt(prompt, options);
    expect(result).toContain('Include Comments: No');
  });
});
