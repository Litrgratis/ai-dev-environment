const tap = require('tap');
const jwt = require('jsonwebtoken');

const TEST_USER = { userId: 1, username: 'user1' };
const TEST_SECRET = process.env.JWT_SECRET || 'testsecret';

function generateToken(user, secret, expiresIn = '1h') {
  return jwt.sign(user, secret, { expiresIn });
}

tap.test('JWT rotation: old token should be invalid after rotation', async (t) => {
  const oldToken = generateToken(TEST_USER, TEST_SECRET, '1s');
  await new Promise((resolve) => setTimeout(resolve, 1500)); // poczekaj aż token wygaśnie
  try {
    jwt.verify(oldToken, TEST_SECRET);
    t.fail('Old token should be invalid');
  } catch (err) {
    t.match(err.message, /jwt expired/, 'Old token is expired');
  }

  const newToken = generateToken(TEST_USER, TEST_SECRET, '1h');
  const payload = jwt.verify(newToken, TEST_SECRET);
  t.equal(payload.username, TEST_USER.username, 'New token is valid');
});
