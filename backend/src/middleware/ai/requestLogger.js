const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../../logs/ai/requests.log');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      duration: duration,
      statusCode: res.statusCode,
      requestSize: JSON.stringify(req.body).length,
      responseSize: data.length,
      provider: req.body?.provider || 'unknown',
      model: req.body?.model || 'unknown'
    };
    
    fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', (err) => {
      if (err) console.error('Failed to write log:', err);
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = requestLogger;
