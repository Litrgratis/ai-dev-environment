// Simple audit module with local logging, optional email notification, and template loader
// To enable email, set AUDIT_EMAIL_ENABLED=true and configure SMTP below

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const AUDIT_LOG_PATH = path.join(__dirname, '../../logs/audit.log');
const AUDIT_EMAIL_ENABLED = process.env.AUDIT_EMAIL_ENABLED === 'true';
const AUDIT_EMAIL = 'litrgratis@gmail.com';

// Configure SMTP (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUDIT_EMAIL_USER || '', // e.g. your Gmail address
    pass: process.env.AUDIT_EMAIL_PASS || '', // e.g. App Password
  },
});

function logAudit(action, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    details,
  };
  fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(entry) + '\n');

  if (AUDIT_EMAIL_ENABLED) {
    transporter.sendMail({
      from: process.env.AUDIT_EMAIL_USER || 'audit@localhost',
      to: AUDIT_EMAIL,
      subject: `[AUDIT] ${action}`,
      text: JSON.stringify(entry, null, 2),
    }, (err) => {
      if (err) {
        fs.appendFileSync(AUDIT_LOG_PATH, `[EMAIL ERROR] ${err}\n`);
      }
    });
  }
}

// Dynamic template loader with validation
function loadTemplate(templateName) {
  const templatesDir = path.join(__dirname, '../../config/prompt-templates');
  const filePath = path.join(templatesDir, `${templateName}.json`);
  if (!fs.existsSync(filePath)) {
    logAudit('template_load_failed', { templateName, error: 'Template not found' });
    throw new Error('Template not found');
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const template = JSON.parse(raw);
    // Simple validation: must have 'prompt' and 'description'
    if (!template.prompt || !template.description) {
      logAudit('template_validation_failed', { templateName, error: 'Missing required fields' });
      throw new Error('Invalid template format');
    }
    logAudit('template_loaded', { templateName });
    return template;
  } catch (err) {
    logAudit('template_load_failed', { templateName, error: err.message });
    throw err;
  }
}

module.exports = { logAudit, loadTemplate };
