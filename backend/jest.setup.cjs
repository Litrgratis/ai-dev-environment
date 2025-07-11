// This setup file will be loaded before tests to mock Redis globally
const RedisMock = require('ioredis-mock');

jest.mock('ioredis', () => {
  return Object.assign(
    function Redis(...args) { return new RedisMock(...args); },
    {
      __esModule: true,
      default: RedisMock,
      Redis: RedisMock
    }
  );
});
