import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiLLM {
  private genAI: any;
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string, model: string = 'gemini-pro') {
    const aiModel = this.genAI.getGenerativeModel({ model });
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
