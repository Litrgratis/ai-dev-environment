module.exports = {
  apiKey: process.env.GEMINI_API_KEY,
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  models: {
    'gemini-pro': 'gemini-pro',
    'gemini-ultra': 'gemini-ultra'
  },
  timeout: 30000,
  maxRetries: 3
};
