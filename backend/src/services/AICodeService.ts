import { IAIProvider } from "../types/IAIProvider.js";
import { ICodeRepository } from "../repositories/ICodeRepository.js";
import { ICacheService } from "../types/ICacheService.js";
import { GeneratedCode, GenerateOptions } from "../types/GeneratedCode.js";

export class AICodeService {
  constructor(
    private aiProvider: IAIProvider,
    private codeRepository: ICodeRepository,
    private cacheService: ICacheService,
  ) {}

  async generateCode(
    prompt: string,
    options: GenerateOptions,
  ): Promise<GeneratedCode> {
    // Business logic: check cache, call AI, save result, etc.
    // ...implementation...
    return {} as GeneratedCode;
  }
}
