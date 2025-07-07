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
  // Use mock pipeline for now
  const result = await mockPipeline(prompt, language);
  res.json(result);
};
