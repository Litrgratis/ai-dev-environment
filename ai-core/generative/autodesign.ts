import { GoogleGenerativeAI } from '@google/generative-ai';

export class AutodesignCore {
  private genAI: any;
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateComponent(requirements: string, type: 'react' | 'fastify' | 'k8s' = 'react') {
    // Szablony promptów dla różnych typów artefaktów
    const templates: Record<string, string> = {
      react: `Stwórz komponent React zgodnie z wymaganiami: {{requirements}}. Kod tylko komponentu, bez wyjaśnień.`,
      fastify: `Stwórz endpoint Fastify zgodnie z wymaganiami: {{requirements}}. Kod tylko endpointu, bez wyjaśnień.`,
      k8s: `Stwórz manifest Kubernetes zgodnie z wymaganiami: {{requirements}}. YAML bez wyjaśnień.`
    };
    const prompt = templates[type].replace('{{requirements}}', requirements);
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async iterateDesign(requirements: string, feedback: string, type: 'react' | 'fastify' | 'k8s' = 'react') {
    // Mechanizm iteracji: popraw projekt na podstawie feedbacku
    const prompt = `Popraw ${type} zgodnie z feedbackiem: ${feedback}. Wymagania: ${requirements}. Kod tylko poprawionego artefaktu.`;
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
