import { GeneratedCode } from "../types/GeneratedCode.js";

export interface ICodeRepository {
  saveGeneratedCode(code: GeneratedCode): Promise<void>;
  getCodeHistory(userId: string): Promise<GeneratedCode[]>;
  deleteCode(id: string): Promise<void>;
}
