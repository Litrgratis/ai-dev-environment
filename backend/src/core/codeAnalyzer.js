const { GoogleGenerativeAI } = require("@google/generative-ai");

class CodeAnalyzer {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 256,
      },
    });
  }

  async analyzeContext(codeContext, language) {
    try {
      const prompt = this.buildCompletionPrompt(codeContext, language);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseCompletionResponse(text);
    } catch (error) {
      console.error("[Gemini] API error:", error);
      throw new Error("Gemini API request failed");
    }
  }

  buildCompletionPrompt(context, language) {
    const { text, cursorPosition, fileName } = context;
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);

    return `
You are a ${language} code completion assistant. Analyze the following code context and provide 4-6 most relevant completion suggestions.

File: ${fileName || "unknown"}
Language: ${language}

Code before cursor:
\`\`\`${language}
${beforeCursor}
\`\`\`

Code after cursor:
\`\`\`${language}
${afterCursor}
\`\`\`

Provide only the completion suggestions as a JSON array of strings. No explanations.
Focus on: variable names, method calls, keywords, and common patterns.

Example output:
["suggestion1", "suggestion2", "suggestion3"]
`;
  }

  parseCompletionResponse(response) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions.slice(0, 6) : [];
      }

      // Fallback: split by lines and clean
      return response
        .split("\n")
        .map((line) => line.trim().replace(/['"`,]/g, ""))
        .filter((line) => line.length > 0 && line.length < 50)
        .slice(0, 6);
    } catch (error) {
      console.error("[Gemini] Failed to parse response:", error);
      return [];
    }
  }

  // FP-16 optimization for faster inference
  async optimizedGenerate(context, language) {
    const suggestions = await this.analyzeContext(context, language);

    // Sort by relevance using simple heuristics
    const sorted = suggestions.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, context);
      const bScore = this.calculateRelevanceScore(b, context);
      return bScore - aScore;
    });

    return sorted;
  }

  calculateRelevanceScore(suggestion, context) {
    let score = 0;
    const beforeCursor = context.text
      .substring(0, context.cursorPosition)
      .toLowerCase();

    // Bonus for matching current typing
    if (beforeCursor.endsWith(suggestion.toLowerCase().substring(0, 2))) {
      score += 10;
    }

    // Bonus for common patterns
    if (suggestion.includes("()")) score += 5; // Methods
    if (suggestion.match(/^[a-z][A-Z]/)) score += 3; // camelCase

    return score;
  }
}

module.exports = { CodeAnalyzer };
