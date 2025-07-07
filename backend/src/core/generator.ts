import { GoogleGenerativeAI } from '@google/generative-ai';
import prompts from '../prompts/templates.json';

export class CodeGenerator {
  private genAI: any;
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string, language: string): Promise<{ code: string }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const template = (prompts.generate as Record<string, string>)[language] || prompts.generate.default;
    const fullPrompt = template.replace('{{prompt}}', prompt);
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return { code: response.text() };
  }

  async improve(code: string, feedback: string): Promise<{ code: string }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const template = prompts.improve.default;
    const fullPrompt = template.replace('{{code}}', code).replace('{{feedback}}', feedback);
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return { code: response.text() };
  }
}
