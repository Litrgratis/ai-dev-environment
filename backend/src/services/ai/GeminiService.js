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

  // Simple circuit-breaker state
  #failCount = 0;
  #breakerOpen = false;
  #breakerTimeout = null;
  #MAX_FAILS = 3;
  #RESET_TIMEOUT = 15000; // ms

  async generateCode(prompt, model = 'gemini-pro', options = {}) {
    if (this.#breakerOpen) {
      return {
        success: false,
        error: 'Circuit breaker open: too many failures',
        provider: 'gemini',
        breaker: true
      };
    }
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
      this.#failCount = 0;
      return {
        success: true,
        data: response.data,
        provider: 'gemini',
        model: model
      };
    } catch (error) {
      this.#failCount++;
      if (this.#failCount >= this.#MAX_FAILS) {
        this.#breakerOpen = true;
        if (!this.#breakerTimeout) {
          this.#breakerTimeout = setTimeout(() => {
            this.#breakerOpen = false;
            this.#failCount = 0;
            this.#breakerTimeout = null;
          }, this.#RESET_TIMEOUT);
        }
      }
      return {
        success: false,
        error: error.message,
        provider: 'gemini',
        breaker: this.#breakerOpen
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
