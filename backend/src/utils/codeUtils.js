// Common code utilities for prompt engineering and code extraction

function buildCodePrompt(prompt, framework, style) {
  let enhancedPrompt = `Generate ${framework || 'JavaScript'} code with ${style || 'modern'} style.\n\n`;
  enhancedPrompt += `Requirements: ${prompt}\n\n`;
  enhancedPrompt += `Please provide clean, well-commented code that follows best practices.`;
  return enhancedPrompt;
}

function extractCode(data) {
  if (data.response) {
    return data.response;
  }
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }
  return data;
}

function extractChatResponse(data) {
  if (data.message && data.message.content) {
    return data.message.content;
  }
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }
  return data;
}

module.exports = { buildCodePrompt, extractCode, extractChatResponse };
