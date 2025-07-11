import { GenerateOptions, GeneratedCode } from "./GeneratedCode";

export interface IAIProvider {
  generateCode(
    prompt: string,
    options: GenerateOptions,
  ): Promise<GeneratedCode>;
}
