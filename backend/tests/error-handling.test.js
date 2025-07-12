const tap = require('tap');
const axios = require('axios');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:8000';

tap.test('Error handling: returns detailed error for invalid login', async (t) => {
  try {
    await axios.post(`${BASE_URL}/api/login`, { username: 'wrong', password: 'wrong' });
    t.fail('Should not login with invalid credentials');
  } catch (err) {
    t.equal(err.response.status, 401, 'Should return 401 Unauthorized');
    t.match(err.response.data.error, /Nieprawidłowa nazwa użytkownika lub hasło/, 'Should return detailed error');
  }
});

tap.test('Error handling: returns 404 for unknown endpoint', async (t) => {
  try {
    await axios.post(`${BASE_URL}/api/unknown-endpoint`, {});
    t.fail('Should not find unknown endpoint');
  } catch (err) {
    t.equal(err.response.status, 404, 'Should return 404 Not Found');
    t.match(err.response.data.error, /Not Found/, 'Should return detailed error');
  }
});
