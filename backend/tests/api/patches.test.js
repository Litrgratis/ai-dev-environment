const Fastify = require('fastify');
const patchRoutes = require('../../src/routes/patches.cjs');
jest.mock('../../src/services/patchService', () => ({
  generatePatch: jest.fn(),
}));
const patchService = require('../../src/services/patchService');

jest.mock('../../src/services/patchService');

describe('Patch Routes', () => {
  let fastify;

  beforeEach(() => {
    fastify = Fastify();
    fastify.register(patchRoutes);
  });

  afterEach(() => {
    fastify.close();
  });

  it('should generate a patch for valid code and instruction', async () => {
    const originalCode = 'console.log("hello world")';
    const instruction = 'change the log message to "hello patched world"';
    const mockPatch = '--- a/file.js\n+++ b/file.js\n@@ -1 +1 @@\n-console.log("hello world")\n+console.log("hello patched world")';
    const mockResponse = {
      patch: mockPatch,
      description: 'Patch generated for instruction: "change the log message to "hello patched world""'
    };
    jest.spyOn(patchService, 'generatePatch').mockResolvedValue(mockResponse);

    const response = await fastify.inject({
      method: 'POST',
      url: '/patches',
      payload: { originalCode, instruction }
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockResponse);
    expect(patchService.generatePatch).toHaveBeenCalledWith(originalCode, instruction);
  });

  it('should return 500 if patch generation fails', async () => {
    const originalCode = 'console.log("hello world")';
    const instruction = 'a failing instruction';
    jest.spyOn(patchService, 'generatePatch').mockRejectedValue(new Error('AI service failed'));

    const response = await fastify.inject({
      method: 'POST',
      url: '/patches',
      payload: { originalCode, instruction }
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({ error: 'Failed to generate patch' });
  });
});
