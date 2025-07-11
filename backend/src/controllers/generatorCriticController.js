const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const runGeneratorCriticPipeline = async (prompt, language) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const iterations = [];
  let currentCode = '';
  
  const maxIterations = 3;
  
  for (let i = 1; i <= maxIterations; i++) {
    // Generator phase
    const generatorPrompt = i === 1 
      ? `Generate ${language} code for: ${prompt}. Return only the code without explanations.`
      : `Improve this ${language} code based on the feedback: ${iterations[i-2].feedback}\n\nCode:\n${currentCode}\n\nReturn only the improved code without explanations.`;
    
    const generatorResult = await model.generateContent(generatorPrompt);
    const generatedCode = generatorResult.response.text();
    currentCode = generatedCode;
    
    // Critic phase
    const criticPrompt = `Review this ${language} code and provide constructive feedback for improvement:\n\n${generatedCode}\n\nFocus on: code quality, performance, error handling, best practices. Be specific and constructive.`;
    
    const criticResult = await model.generateContent(criticPrompt);
    const feedback = criticResult.response.text();
    
    iterations.push({
      code: generatedCode,
      feedback: feedback,
      language,
      iteration: i
    });
    
    // If feedback is very positive, we can stop early
    if (feedback.toLowerCase().includes('excellent') || feedback.toLowerCase().includes('no issues')) {
      break;
    }
  }
  
  return {
    finalCode: currentCode,
    iterations
  };
};

const mockPipeline = async (prompt, language) => {
  const iterations = [
    {
      code: `// ${language} code v1 for: ${prompt}`,
      feedback: 'Needs better error handling.',
      language,
      iteration: 1
    },
    {
      code: `// ${language} code v2 for: ${prompt}`,
      feedback: 'Consider performance improvements.',
      language,
      iteration: 2
    },
    {
      code: `// ${language} code v3 for: ${prompt}`,
      feedback: 'Looks good! No errors found.',
      language,
      iteration: 3
    }
  ];
  return {
    finalCode: iterations[2].code,
    iterations
  };
};

exports.generatorCritic = async (req, res) => {
  const { prompt, language } = req.body;
  if (!prompt || !language) {
    return res.status(400).json({ error: 'Missing prompt or language' });
  }
  
  try {
    // Use real AI pipeline if API key is available, otherwise use mock
    const result = process.env.GEMINI_API_KEY 
      ? await runGeneratorCriticPipeline(prompt, language)
      : await mockPipeline(prompt, language);
    
    res.json(result);
  } catch (error) {
    console.error('Generator-Critic pipeline error:', error);
    // Fallback to mock on error
    const result = await mockPipeline(prompt, language);
    res.json(result);
  }
};
