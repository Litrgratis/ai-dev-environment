const axios = require('axios');
const config = require('../../../config/ai-providers/gemini');

class GeminiService {
  constructor() {
    this.baseURL = config.baseUrl;
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateCode(prompt, model = 'gemini-pro', options = {}) {
    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topP: options.top_p || 0.9,
        maxOutputTokens: options.max_tokens || 2048
      }
    };

    try {
      const response = await this.client.post(
        `/models/${config.models[model] || config.models['gemini-pro']}:generateContent?key=${this.apiKey}`,
        payload
      );
      
      return {
        success: true,
        data: response.data,
        provider: 'gemini',
        model: model
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'gemini'
      };
    }
  }

  async chatComplete(messages, model = 'gemini-pro', options = {}) {
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));

    const payload = {
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        topP: options.top_p || 0.9,
        maxOutputTokens: options.max_tokens || 2048
      }
    };

    try {
      const response = await this.client.post(
        `/models/${config.models[model] || config.models['gemini-pro']}:generateContent?key=${this.apiKey}`,
        payload
      );
      
      return {
        success: true,
        data: response.data,
        provider: 'gemini',
        model: model
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'gemini'
      };
    }
  }

  async listModels() {
    try {
      const response = await this.client.get(`/models?key=${this.apiKey}`);
      return {
        success: true,
        models: response.data.models,
        provider: 'gemini'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'gemini'
      };
    }
  }

  async healthCheck() {
    try {
      const response = await this.client.get(`/models?key=${this.apiKey}`);
      return {
        success: true,
        status: 'healthy',
        provider: 'gemini'
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        provider: 'gemini'
      };
    }
  }
}

module.exports = GeminiService;
