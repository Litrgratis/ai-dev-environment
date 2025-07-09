
const AIService = require('../../src/services/aiService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  const mockGenerativeAI = jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: mockGenerateContent,
    })),
  }));
  return {
    GoogleGenerativeAI: mockGenerativeAI,
    mockGenerateContent, 
  };
});

describe('AIService', () => {
  let aiService;
  let mockGenerateContent;

  beforeEach(() => {
    jest.clearAllMocks();
    aiService = new AIService();
    mockGenerateContent = require('@google/generative-ai').mockGenerateContent;
  });

  it('should return a successful response from the AI', async () => {
    const mockResponse = {
      response: {
        text: () => 'Generated code',
      },
    };
    mockGenerateContent.mockResolvedValue(mockResponse);

    const result = await aiService.generateCompletion('Test prompt');
    expect(result).toEqual({ success: true, code: 'Generated code' });
    expect(mockGenerateContent).toHaveBeenCalledWith('Test prompt');
  });

  it('should handle AI content generation failure', async () => {
    mockGenerateContent.mockResolvedValue({ response: null });

    const result = await aiService.generateCompletion('Test prompt');
    expect(result).toEqual({ success: false, error: 'Failed to generate content' });
  });

  it('should handle errors during AI communication', async () => {
    const error = new Error('API error');
    mockGenerateContent.mockRejectedValue(error);

    const result = await aiService.generateCompletion('Test prompt');
    expect(result).toEqual({ success: false, error: 'Error communicating with AI' });
  });
});
