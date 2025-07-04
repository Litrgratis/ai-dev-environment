import { IAIProvider } from '../types/IAIProvider';
import { ICodeRepository } from '../repositories/ICodeRepository';
import { ICacheService } from '../types/ICacheService';
import { GeneratedCode, GenerateOptions } from '../types/GeneratedCode';

export class AICodeService {
  constructor(
    private aiProvider: IAIProvider,
    private codeRepository: ICodeRepository,
    private cacheService: ICacheService
  ) {}

  async generateCode(prompt: string, options: GenerateOptions): Promise<GeneratedCode> {
    // Business logic: check cache, call AI, save result, etc.
    // ...implementation...
    return {} as GeneratedCode;
  }
}
