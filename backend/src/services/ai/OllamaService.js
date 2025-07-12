const axios = require('axios');
const config = require('../../../config/ai-providers/ollama');

class OllamaService {
  constructor() {
    this.baseURL = `http://${config.host}:${config.port}`;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateCode(prompt, model = 'codellama', options = {}) {
    const payload = {
      model: config.models[model] || config.models.codellama,
      prompt: prompt,
      stream: options.stream || false,
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        num_predict: options.max_tokens || 2048
      }
    };

    try {
      const response = await this.client.post('/api/generate', payload);
      return {
        success: true,
        data: response.data,
        provider: 'ollama',
        model: payload.model
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'ollama'
      };
    }
  }

  async chatComplete(messages, model = 'llama3', options = {}) {
    const payload = {
      model: config.models[model] || config.models.llama3,
      messages: messages,
      stream: options.stream || false,
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9
      }
    };

    try {
      const response = await this.client.post('/api/chat', payload);
      return {
        success: true,
        data: response.data,
        provider: 'ollama',
        model: payload.model
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'ollama'
      };
    }
  }

  async listModels() {
    try {
      const response = await this.client.get('/api/tags');
      return {
        success: true,
        models: response.data.models,
        provider: 'ollama'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'ollama'
      };
    }
  }

  async pullModel(modelName) {
    try {
      const response = await this.client.post('/api/pull', {
        name: modelName
      });
      return {
        success: true,
        data: response.data,
        provider: 'ollama'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'ollama'
      };
    }
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/api/tags');
      return {
        success: true,
        status: 'healthy',
        provider: 'ollama'
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        provider: 'ollama'
      };
    }
  }
}

module.exports = OllamaService;
