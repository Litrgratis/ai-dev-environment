module.exports = {
  host: process.env.OLLAMA_HOST || 'localhost',
  port: process.env.OLLAMA_PORT || 11434,
  models: {
    'codellama': 'codellama:7b-instruct',
    'llama3': 'llama3.1:8b-instruct',
    'mistral': 'mistral:7b-instruct',
    'deepseek': 'deepseek-coder:6.7b-instruct'
  },
  timeout: 30000,
  maxRetries: 3,
  streaming: true
};
