const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdmZip = require('adm-zip');
const SecurityMiddleware = require('./middleware');
const http = require('http');
const { setupMetrics, metricsInterval } = require('./src/monitoring/metrics');
const { WebSocketHandler } = require('./src/routes/websocket');
require('dotenv').config();

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Prosta baza użytkowników w pamięci (w produkcji użyj bazy danych)
  const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) }
  ];

  // Middleware do weryfikacji tokenu JWT
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' });
      req.user = user;
      next();
    });
  };

  // Inicjalizacja Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // Setup security middleware
  SecurityMiddleware.setupSecurity(app);

  // Endpoint logowania
  app.post('/api/login', 
    SecurityMiddleware.validateLogin(),
    SecurityMiddleware.handleValidationErrors,
    SecurityMiddleware.sanitizeInput,
    SecurityMiddleware.auditLog,
    async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });

  // Endpoint generowania kodu
  app.post('/api/generate-code', 
    authenticateToken,
    SecurityMiddleware.validateCodeGeneration(),
    SecurityMiddleware.handleValidationErrors,
    SecurityMiddleware.sanitizeInput,
    SecurityMiddleware.auditLog,
    async (req, res) => {
    try {
      const { prompt, framework, style, temperature, includeComments } = req.body;
      const model = genAI.getGenerativeModel({ model: 'gemini-pro', temperature });
      const result = await model.generateContent(`Generuj strukturę projektu w ${framework} o stylu ${style}. ${includeComments ? 'Dodaj komentarze.' : ''} Treść: ${prompt}. Zwróć odpowiedź w formacie JSON z kluczami: "files" (obiekt z nazwami plików jako klucze i ich zawartością jako wartości).`);
      const response = await result.response;
      const files = JSON.parse(response.text());
      const zip = new AdmZip();
      for (const [fileName, content] of Object.entries(files)) {
        zip.addFile(fileName, Buffer.from(content));
      }
      const zipBuffer = zip.toBuffer();
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=project.zip`);
      res.send(zipBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Błąd serwera podczas generowania kodu AI.' });
    }
  });

  // Endpoint do pobierania głównego pliku
  app.post('/api/get-main-file', authenticateToken, async (req, res) => {
    try {
      const { prompt } = req.body;
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(`Generuj główny plik kodu (np. App.js) dla projektu React na podstawie promptu: ${prompt}.`);
      const response = await result.response;
      const generatedCode = response.text();
      res.json({ generatedCode });
    } catch (error) {
      res.status(500).json({ error: 'Błąd serwera podczas pobierania głównego pliku.' });
    }
  });

  // Endpoint czatu
  app.post('/api/chat', 
    authenticateToken,
    SecurityMiddleware.validateChatMessage(),
    SecurityMiddleware.handleValidationErrors,
    SecurityMiddleware.sanitizeInput,
    SecurityMiddleware.auditLog,
    async (req, res) => {
    try {
      const { message, model: modelName, temperature } = req.body;
      const model = genAI.getGenerativeModel({ model: modelName || 'gemini-pro', temperature });
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      res.json({ response: text });
    } catch (error) {
      res.status(500).json({ error: 'Błąd serwera podczas przetwarzania czatu AI.' });
    }
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not Found' }));

  const server = http.createServer(app);

  return { app, server, metricsInterval };
}

if (require.main === module) {
  const { server } = createServer();
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

module.exports = { createServer };
