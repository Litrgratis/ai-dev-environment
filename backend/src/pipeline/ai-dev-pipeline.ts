import { CodeGenerator } from '../core/generator';
import { CodeCritic } from '../core/critic';

export class AIDevPipeline {
  constructor(private generator: CodeGenerator, private critic: CodeCritic) {}

  async run(prompt: string, language: string, maxIterations: number = 3): Promise<string> {
    let code = await this.generator.generate(prompt, language);
    for (let i = 0; i < maxIterations; i++) {
      const feedback = await this.critic.analyze(code.code, language);
      if (!feedback.includes('error')) break;
      code = await this.generator.improve(code.code, feedback);
    }
    return code.code;
  }
}
