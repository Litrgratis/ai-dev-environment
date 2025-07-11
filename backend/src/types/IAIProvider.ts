import { GenerateOptions, GeneratedCode } from "./GeneratedCode.js";

export interface IAIProvider {
  generateCode(
    prompt: string,
    options: GenerateOptions,
  ): Promise<GeneratedCode>;
}
