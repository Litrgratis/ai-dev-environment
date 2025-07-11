module.exports = {
  generateCompletion: jest.fn().mockResolvedValue({ success: true, code: "Generated code" }),
  generateCode: jest.fn().mockResolvedValue("mocked code"),
  processRequest: jest.fn().mockResolvedValue({ success: true }),
};
