import { Configuration, OpenAIApi } from 'openai';

export class OpenAILLM {
  private openai: OpenAIApi;
  constructor(apiKey: string) {
    const config = new Configuration({ apiKey });
    this.openai = new OpenAIApi(config);
  }

  async generate(prompt: string, model: string = 'gpt-3.5-turbo') {
    const response = await this.openai.createChatCompletion({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });
    return response.data.choices[0].message.content;
  }
}
