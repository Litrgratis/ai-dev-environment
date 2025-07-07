const request = require('supertest');
const { app } = require('./src/server');

describe('API Endpoints', () => {
  it('POST /api/generate-code should return a ZIP file', async () => {
    const response = await request(app).post('/api/generate-code').expect(200);
    expect(response.headers['content-type']).toMatch(/zip/);
  }, 10000);
});
