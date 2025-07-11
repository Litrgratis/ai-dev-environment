import axios from "axios";

export class OllamaLLM {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async generate(prompt: string, model: string = "llama3") {
    const response = await axios.post(`${this.baseUrl}/api/generate`, {
      model,
      prompt,
      stream: false,
    });
    return response.data.response;
  }
}
