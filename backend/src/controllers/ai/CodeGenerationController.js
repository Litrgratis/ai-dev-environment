const AIProviderManager = require('../../services/ai/AIProviderManager');

class CodeGenerationController {
  constructor() {
    this.aiManager = new AIProviderManager();
  }

  async generateCode(req, res) {
    try {
      const { prompt, framework, style, provider, model, options } = req.body;
      
      if (!prompt || prompt.trim().length < 10) {
        return res.status(400).json({
          error: 'Prompt must be at least 10 characters long'
        });
      }

      const enhancedPrompt = this.buildCodePrompt(prompt, framework, style);
      
      const result = await this.aiManager.generateCode(enhancedPrompt, provider, {
        model,
        ...options
      });

      if (!result.success) {
        return res.status(500).json({
          error: 'Code generation failed',
          details: result.error
        });
      }

      res.json({
        success: true,
        code: this.extractCode(result.data),
        metadata: {
          provider: result.provider,
          model: result.model,
          framework,
          style
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  async chatWithAI(req, res) {
    try {
      const { messages, provider, model, options } = req.body;
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: 'Messages array is required and must not be empty'
        });
      }

      const result = await this.aiManager.chatComplete(messages, provider, {
        model,
        ...options
      });

      if (!result.success) {
        return res.status(500).json({
          error: 'Chat completion failed',
          details: result.error
        });
      }

      res.json({
        success: true,
        response: this.extractChatResponse(result.data),
        metadata: {
          provider: result.provider,
          model: result.model
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  async getAvailableModels(req, res) {
    try {
      const { provider } = req.query;
      const result = await this.aiManager.getAvailableModels(provider);
      
      res.json({
        success: true,
        models: result.models || result,
        provider: result.provider
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch models',
        message: error.message
      });
    }
  }

  async healthCheck(req, res) {
    try {
      const { provider } = req.query;
      const result = await this.aiManager.healthCheck(provider);
      
      res.json({
        success: true,
        health: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Health check failed',
        message: error.message
      });
    }
  }

  buildCodePrompt(prompt, framework, style) {
    let enhancedPrompt = `Generate ${framework || 'JavaScript'} code with ${style || 'modern'} style.\n\n`;
    enhancedPrompt += `Requirements: ${prompt}\n\n`;
    enhancedPrompt += `Please provide clean, well-commented code that follows best practices.`;
    
    return enhancedPrompt;
  }

  extractCode(data) {
    if (data.response) {
      return data.response;
    }
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return data;
  }

  extractChatResponse(data) {
    if (data.message && data.message.content) {
      return data.message.content;
    }
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return data;
  }
}

module.exports = CodeGenerationController;
