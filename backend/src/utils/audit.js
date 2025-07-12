// Simple audit module with local logging and optional email notification
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

module.exports = { logAudit };
