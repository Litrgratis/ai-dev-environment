const jest = require('jest-mock');

module.exports = {
  generateCompletion: jest.fn(async (prompt) => {
    if (prompt === 'Test prompt') {
      return { success: true, code: 'Generated code' };
    }
    if (prompt === 'fail') {
      return { success: false, error: 'Failed to generate content' };
    }
    return { success: false, error: 'Error communicating with AI' };
  }),
  generateCode: jest.fn(),
  processRequest: jest.fn(),
};
