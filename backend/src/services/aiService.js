const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateCode(prompt, options = {}) {
    const {
      model = 'gemini-pro',
      temperature = 0.7,
      framework = 'react',
      style = 'modern',
      includeComments = true,
      language = 'javascript'
    } = options;

    try {
      const aiModel = this.genAI.getGenerativeModel({ 
        model, 
        temperature,
        generationConfig: {
          maxOutputTokens: 4096,
          topK: 40,
          topP: 0.95,
        }
      });

      const enhancedPrompt = this.buildEnhancedPrompt(prompt, {
        framework,
        style,
        includeComments,
        language
      });

      const result = await aiModel.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      return this.parseGeneratedCode(text);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  buildEnhancedPrompt(prompt, options) {
    const { framework, style, includeComments, language } = options;
    
    return `
You are an expert software developer. Generate high-quality, production-ready code based on the following requirements:

Project Requirements: ${prompt}

Technical Specifications:
- Framework: ${framework}
- Programming Language: ${language}
- Code Style: ${style}
- Include Comments: ${includeComments ? 'Yes' : 'No'}

Please provide:
1. Clean, well-structured code
2. Proper error handling
3. Performance optimizations
4. Security best practices
5. Comprehensive documentation

Return the response in JSON format with the following structure:
{
  "files": {
    "filename.ext": "file content...",
    "another-file.ext": "file content..."
  },
  "dependencies": ["dependency1", "dependency2"],
  "description": "Brief description of the generated code",
  "setup_instructions": "Step-by-step setup instructions"
}

Ensure all code follows modern best practices and is ready for production use.
    `;
  }

  parseGeneratedCode(text) {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      // If JSON parsing fails, create a structure manually
      return {
        files: {
          'main.js': text
        },
        dependencies: [],
        description: 'Generated code',
        setup_instructions: 'No specific setup instructions provided'
      };
    }
  }

  async analyzeCode(code, options = {}) {
    const { model = 'gemini-pro' } = options;

    try {
      const aiModel = this.genAI.getGenerativeModel({ model });
      
      const prompt = `
Analyze the following code and provide detailed feedback:

\`\`\`
${code}
\`\`\`

Please provide:
1. Code quality assessment
2. Performance issues and optimizations
3. Security vulnerabilities
4. Best practices recommendations
5. Suggested improvements

Return the response in JSON format.
      `;

      const result = await aiModel.generateContent(prompt);
      const response = await result.response;
      
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Code Analysis Error:', error);
      throw new Error(`Code analysis failed: ${error.message}`);
    }
  }

  async debugCode(code, error, options = {}) {
    const { model = 'gemini-pro' } = options;

    try {
      const aiModel = this.genAI.getGenerativeModel({ model });
      
      const prompt = `
Help debug the following code that's producing an error:

Code:
\`\`\`
${code}
\`\`\`

Error:
${error}

Please provide:
1. Root cause analysis
2. Suggested fixes
3. Prevention strategies
4. Improved code version

Return the response in JSON format.
      `;

      const result = await aiModel.generateContent(prompt);
      const response = await result.response;
      
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Debug Error:', error);
      throw new Error(`Debug assistance failed: ${error.message}`);
    }
  }

  async optimizeCode(code, options = {}) {
    const { model = 'gemini-pro', targetMetric = 'performance' } = options;

    try {
      const aiModel = this.genAI.getGenerativeModel({ model });
      
      const prompt = `
Optimize the following code for ${targetMetric}:

\`\`\`
${code}
\`\`\`

Please provide:
1. Optimized version of the code
2. Performance improvements made
3. Trade-offs considered
4. Benchmarking suggestions

Return the response in JSON format.
      `;

      const result = await aiModel.generateContent(prompt);
      const response = await result.response;
      
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Optimization Error:', error);
      throw new Error(`Code optimization failed: ${error.message}`);
    }
  }

  async generatePatch(originalCode, instruction, options = {}) {
    const { model = 'gemini-pro' } = options;

    try {
      const aiModel = this.genAI.getGenerativeModel({ model });
      
      const prompt = `
You are an expert software developer specializing in code refactoring and updates. Your task is to generate a code patch based on the provided original code and an instruction for changes.

Original Code:
\`\`\`
${originalCode}
\`\`\`

Instruction:
"${instruction}"

Please generate a patch in the unified diff format. The patch should only contain the changes needed to accomplish the instruction.

Example of a patch for adding a parameter to a function:
--- a/file.js
+++ b/file.js
@@ -1,4 +1,4 @@
-function greet(name) {
-  console.log("Hello, " + name);
+function greet(name, punctuation) {
+  console.log("Hello, " + name + punctuation);
 }

Return ONLY the patch content.
      `;

      const result = await aiModel.generateContent(prompt);
      const response = await result.response;
      const patch = await response.text();
      
      return {
        patch,
        description: `Patch generated for instruction: "${instruction}"`
      };
    } catch (error) {
      console.error('Patch Generation Error:', error);
      throw new Error(`Patch generation failed: ${error.message}`);
    }
  }
}

module.exports = AIService;
