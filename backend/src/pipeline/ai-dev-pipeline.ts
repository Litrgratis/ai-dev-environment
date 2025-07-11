import { CodeGenerator } from "../core/generator";
import { CodeCritic } from "../core/critic";

export type SupportedLanguage = "javascript" | "python" | "java";

export interface GeneratorCriticIteration {
  code: string;
  feedback: string;
  language: SupportedLanguage;
  iteration: number;
}

export interface GeneratorCriticResult {
  finalCode: string;
  iterations: GeneratorCriticIteration[];
}

export class AIDevPipeline {
  constructor(
    private generator: CodeGenerator,
    private critic: CodeCritic,
  ) {}

  async run(
    prompt: string,
    language: SupportedLanguage,
    maxIterations: number = 3,
  ): Promise<GeneratorCriticResult> {
    if (!["javascript", "python", "java"].includes(language)) {
      throw new Error("Unsupported language. Use javascript, python, or java.");
    }
    let code = await this.generator.generate(prompt, language);
    const iterations: GeneratorCriticIteration[] = [];
    for (let i = 0; i < maxIterations; i++) {
      const feedback = await this.critic.analyze(code.code, language);
      iterations.push({
        code: code.code,
        feedback,
        language,
        iteration: i + 1,
      });
      if (
        !feedback.toLowerCase().includes("error") &&
        !feedback.toLowerCase().includes("błąd")
      )
        break;
      code = await this.generator.improve(code.code, feedback);
    }
    return {
      finalCode: code.code,
      iterations,
    };
  }
}
