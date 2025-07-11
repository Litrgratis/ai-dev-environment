import { IAIProvider } from "../types/IAIProvider.js";
import { GeminiProvider } from "../providers/GeminiProvider.js";
import { OpenAIProvider } from "../providers/OpenAIProvider.js";
import { ClaudeProvider } from "../providers/ClaudeProvider.js";

export class AIProviderFactory {
  static create(provider: "gemini" | "openai" | "claude"): IAIProvider {
    switch (provider) {
      case "gemini":
        return new GeminiProvider();
      case "openai":
        return new OpenAIProvider();
      case "claude":
        return new ClaudeProvider();
      default:
        throw new Error("Unknown AI provider");
    }
  }
}
