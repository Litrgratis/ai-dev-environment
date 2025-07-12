const tap = require('tap');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:8000';
const TEST_USER = { userId: 1, username: 'user1' };
const TEST_SECRET = process.env.JWT_SECRET || 'testsecret';
const TEST_TOKEN = jwt.sign(TEST_USER, TEST_SECRET, { expiresIn: '1h' });

tap.test('POST /api/ollama/generate returns code from Ollama', async (t) => {
  const response = await axios.post(
    `${BASE_URL}/api/ollama/generate`,
    { prompt: 'console.log("Hello Ollama!")', model: 'llama2' },
    { headers: { Authorization: `Bearer ${TEST_TOKEN}` } }
  );
  t.equal(response.status, 200, 'Should return 200 OK');
  t.ok(response.data.output, 'Should return output from Ollama');
  t.equal(response.data.model, 'llama2', 'Should return correct model');
});
