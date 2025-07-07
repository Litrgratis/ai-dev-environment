import { parse } from 'esprima';
import prompts from '../prompts/templates.json';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class CodeCritic {
  private llm: any;
  constructor(apiKey: string) {
    this.llm = new GoogleGenerativeAI(apiKey);
  }

  async analyze(code: string, language: string): Promise<string> {
    try {
      if (language === 'javascript') parse(code); // składnia JS
      // Można dodać obsługę innych języków (np. ast dla Python)
      const model = this.llm.getGenerativeModel({ model: 'gemini-pro' });
      const template = prompts.analyze[language] || prompts.analyze.default;
      const fullPrompt = template.replace('{{code}}', code);
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return `Syntax error: ${error.message}`;
    }
  }
}
