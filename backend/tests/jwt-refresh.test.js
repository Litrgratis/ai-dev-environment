const tap = require('tap');
const axios = require('axios');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:8000';

let refreshToken;
let accessToken;

// Simulate login to get refresh token
async function login() {
  const res = await axios.post(`${BASE_URL}/api/login`, {
    username: 'testuser',
    password: 'testpassword',
  });
  accessToken = res.data.accessToken;
  refreshToken = res.data.refreshToken;
}

tap.test('JWT refresh: should issue new access token with valid refresh token', async (t) => {
  await login();
  const res = await axios.post(`${BASE_URL}/api/token/refresh`, {
    refreshToken,
  });
  t.ok(res.data.accessToken, 'Should return new access token');
  t.notEqual(res.data.accessToken, accessToken, 'New token should be different');
});

tap.test('JWT refresh: should fail with invalid refresh token', async (t) => {
  try {
    await axios.post(`${BASE_URL}/api/token/refresh`, {
      refreshToken: 'invalidtoken',
    });
    t.fail('Should not refresh with invalid token');
  } catch (err) {
    t.equal(err.response.status, 401, 'Should return 401 Unauthorized');
    t.match(err.response.data.error, /Invalid refresh token/, 'Should return detailed error');
  }
});
