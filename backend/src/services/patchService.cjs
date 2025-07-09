const AIService = require('./aiService');
const aiService = new AIService();

async function generatePatch(originalCode, instruction) {
  try {
    const result = await aiService.generatePatch(originalCode, instruction);
    return result;
  } catch (error) {
    console.error(`Error in patchService: ${error.message}`);
    throw new Error('Failed to generate patch in service');
  }
}

module.exports = {
  generatePatch
};
