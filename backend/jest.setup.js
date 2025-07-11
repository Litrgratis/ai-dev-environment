// Globalne ustawienia dla testów

// Obsługa fetch API (jeśli używane)
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();
global.fetch = fetchMock;

// Timeout dla testów
jest.setTimeout(30000);

// Mockowanie zmiennych środowiskowych
process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = 'test-api-key-mock';
process.env.REDIS_URL = 'redis://localhost:6379';

// Globalne mocki dla problemowych modułów
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    quit: jest.fn().mockResolvedValue(true),
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    flushall: jest.fn()
  }))
}));

// Globalny mock ioredis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    expire: jest.fn(),
    exists: jest.fn(),
    disconnect: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    removeListener: jest.fn(),
    flushall: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
  }));
});

// Mock dla Gemini API
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Mocked AI response')
        }
      })
    }))
  }))
}));

// Globalne cleanup po testach
afterEach(async () => {
  // Cleanup Redis connections
  jest.clearAllMocks();
});

afterAll(async () => {
  // Zamknij wszystkie otwarte połączenia
  await new Promise(resolve => setTimeout(resolve, 100));
});

// Obsługa nieobsłużonych promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Promise Rejection:', reason);
});

// Wyłączenie logów w testach (opcjonalne)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn()
// };