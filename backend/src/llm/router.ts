import { GeminiLLM } from './gemini';
import { OpenAILLM } from './openai';
import { OllamaLLM } from './ollama';

export class LLMRouter {
  private gemini: GeminiLLM;
  private openai: OpenAILLM;
  private ollama: OllamaLLM;

  constructor(config: { geminiKey: string; openaiKey: string; ollamaUrl: string }) {
    this.gemini = new GeminiLLM(config.geminiKey);
    this.openai = new OpenAILLM(config.openaiKey);
    this.ollama = new OllamaLLM(config.ollamaUrl);
  }

  async generate(prompt: string, opts: { provider: 'gemini' | 'openai' | 'ollama', model?: string }) {
    switch (opts.provider) {
      case 'gemini':
        return this.gemini.generate(prompt, opts.model);
      case 'openai':
        return this.openai.generate(prompt, opts.model);
      case 'ollama':
        return this.ollama.generate(prompt, opts.model);
      default:
        throw new Error('Unknown LLM provider');
    }
  }
}
