const ollama = require('./ollama');
const gemini = require('./gemini');

module.exports = {
  providers: {
    ollama,
    gemini
  },
  defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'ollama',
  fallbackProvider: process.env.FALLBACK_AI_PROVIDER || 'gemini'
};
