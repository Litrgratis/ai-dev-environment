// Mock dla AIService.generateCompletion (globalny i dla importu)
if (!global.AIService) {
  global.AIService = {};
}
global.AIService.generateCompletion = jest.fn().mockResolvedValue({ success: true, code: 'Generated code' });
jest.mock('./src/services/aiService', () => ({
  generateCompletion: jest.fn().mockResolvedValue({ success: true, code: 'Generated code' }),
}));

// Mock dla openai
jest.mock('openai', () => ({
  Configuration: jest.fn(),
  OpenAIApi: jest.fn(() => ({
    createCompletion: jest.fn().mockResolvedValue({ data: { choices: [{ text: 'Mocked OpenAI response' }] } })
  }))
}));

// Mock dla node-fetch (dla testów inference/model-serving)
jest.mock('node-fetch', () => jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ result: 'mocked fetch result' }),
  text: () => Promise.resolve('mocked fetch text'),
})));
// This setup file will be loaded before tests to mock Redis globally
const RedisMock = require("ioredis-mock");

jest.mock("ioredis", () => {
  return Object.assign(
    function Redis(...args) {
      return new RedisMock(...args);
    },
    {
      __esModule: true,
      default: RedisMock,
      Redis: RedisMock,
    },
  );
});
