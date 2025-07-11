const fs = require('fs');
const path = require('path');
const kbPath = path.join(__dirname, '../config/knowledge-base.yaml');
const logPath = path.join(__dirname, '../logs/ai-dev-environment.log');

function updateKnowledgeBase() {
  const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
  const kb = fs.existsSync(kbPath) ? fs.readFileSync(kbPath, 'utf8') : '';
  // Simple append for demo
  fs.writeFileSync(kbPath, kb + '\n# Update:\n' + log);
}

updateKnowledgeBase();
