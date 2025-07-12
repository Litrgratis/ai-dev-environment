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

  // Simple circuit-breaker state
  #failCount = 0;
  #breakerOpen = false;
  #breakerTimeout = null;
  #MAX_FAILS = 3;
  #RESET_TIMEOUT = 15000; // ms

  async generateCode(prompt, model = 'codellama', options = {}) {
    if (this.#breakerOpen) {
      return {
        success: false,
        error: 'Circuit breaker open: too many failures',
        provider: 'ollama',
        breaker: true
      };
    }
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
    // Exponential backoff retry
    const maxRetries = 5;
    let attempt = 0;
    let lastError = null;
    while (attempt < maxRetries) {
      try {
        const response = await this.client.post('/api/generate', payload);
        this.#failCount = 0;
        return {
          success: true,
          data: response.data,
          provider: 'ollama',
          model: payload.model
        };
      } catch (error) {
        lastError = error;
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
        // Exponential backoff
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 200));
        attempt++;
      }
    }
    return {
      success: false,
      error: lastError ? lastError.message : 'Unknown error',
      provider: 'ollama',
      breaker: this.#breakerOpen
    };
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
