// CommonJS syntax
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!node-fetch|@google/generative-ai|ioredis-mock|other-esm-deps)/'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
};
