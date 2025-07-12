const OllamaService = require('./OllamaService');
const GeminiService = require('./GeminiService');
const config = require('../../../config/ai-providers');

class AIProviderManager {
  constructor() {
    this.providers = {
      ollama: new OllamaService(),
      gemini: new GeminiService()
    };
    this.defaultProvider = config.defaultProvider;
    this.fallbackProvider = config.fallbackProvider;
  }

  async generateCode(prompt, provider = null, options = {}) {
    const selectedProvider = provider || this.defaultProvider;
    
    try {
      const result = await this.providers[selectedProvider].generateCode(prompt, options.model, options);
      
      if (!result.success && this.fallbackProvider && selectedProvider !== this.fallbackProvider) {
        console.log(`Provider ${selectedProvider} failed, falling back to ${this.fallbackProvider}`);
        return await this.providers[this.fallbackProvider].generateCode(prompt, options.model, options);
      }
      
      return result;
    } catch (error) {
      if (this.fallbackProvider && selectedProvider !== this.fallbackProvider) {
        console.log(`Provider ${selectedProvider} error, falling back to ${this.fallbackProvider}`);
        return await this.providers[this.fallbackProvider].generateCode(prompt, options.model, options);
      }
      
      throw error;
    }
  }

  async chatComplete(messages, provider = null, options = {}) {
    const selectedProvider = provider || this.defaultProvider;
    
    try {
      const result = await this.providers[selectedProvider].chatComplete(messages, options.model, options);
      
      if (!result.success && this.fallbackProvider && selectedProvider !== this.fallbackProvider) {
        return await this.providers[this.fallbackProvider].chatComplete(messages, options.model, options);
      }
      
      return result;
    } catch (error) {
      if (this.fallbackProvider && selectedProvider !== this.fallbackProvider) {
        return await this.providers[this.fallbackProvider].chatComplete(messages, options.model, options);
      }
      
      throw error;
    }
  }

  async getAvailableModels(provider = null) {
    const selectedProvider = provider || this.defaultProvider;
    return await this.providers[selectedProvider].listModels();
  }

  async healthCheck(provider = null) {
    if (provider) {
      return await this.providers[provider].healthCheck();
    }
    
    const results = {};
    for (const [name, service] of Object.entries(this.providers)) {
      results[name] = await service.healthCheck();
    }
    return results;
  }
}

module.exports = AIProviderManager;
