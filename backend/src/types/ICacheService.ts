export interface ICacheService {
  cacheCodeGeneration(prompt: string, code: string): Promise<void>;
  getCachedCode(prompt: string): Promise<string | null>;
  invalidateCache(pattern: string): Promise<void>;
}
