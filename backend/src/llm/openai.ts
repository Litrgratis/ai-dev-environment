import OpenAI from "openai";

export class OpenAILLM {
  private openai: any;
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generate(prompt: string, model: string = "gpt-3.5-turbo") {
    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  }
}
