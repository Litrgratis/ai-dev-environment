import { GeneratedCode } from "../types/GeneratedCode";

export interface ICodeRepository {
  saveGeneratedCode(code: GeneratedCode): Promise<void>;
  getCodeHistory(userId: string): Promise<GeneratedCode[]>;
  deleteCode(id: string): Promise<void>;
}
