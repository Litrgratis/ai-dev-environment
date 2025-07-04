import { IAIProvider } from '../types/IAIProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { ClaudeProvider } from '../providers/ClaudeProvider';

export class AIProviderFactory {
  static create(provider: 'gemini' | 'openai' | 'claude'): IAIProvider {
    switch (provider) {
      case 'gemini': return new GeminiProvider();
      case 'openai': return new OpenAIProvider();
      case 'claude': return new ClaudeProvider();
      default: throw new Error('Unknown AI provider');
    }
  }
}
