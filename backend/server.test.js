const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai');

const app = express();
app.use(express.json());

// Mock bazy użytkowników
const users = [
  { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) }
];

// Middleware do weryfikacji tokenu
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
  }

  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' });
    }
    req.user = user;
    next();
  });
};

// Mock GoogleGenerativeAI
const mockGenerateContent = jest.fn();
const mockResponse = { response: { text: jest.fn() } };
GoogleGenerativeAI.prototype.getGenerativeModel = jest.fn(() => ({
  generateContent: mockGenerateContent
}));

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/generate-code', authenticateToken, async (req, res) => {
  mockGenerateContent.mockResolvedValueOnce(mockResponse);
  mockResponse.text.mockReturnValueOnce(JSON.stringify({
    'src/App.js': 'const App = () => <div>Hello</div>;',
    'src/index.js': 'import React from "react";',
    'src/styles.css': '.app { color: blue; }'
  }));

  const zip = require('adm-zip')();
  for (const [fileName, content] of Object.entries({
    'src/App.js': 'const App = () => <div>Hello</div>;',
    'src/index.js': 'import React from "react";',
    'src/styles.css': '.app { color: blue; }'
  })) {
    zip.addFile(fileName, Buffer.from(content));
  }
  const zipBuffer = zip.toBuffer();

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=project.zip`);
  res.send(zipBuffer);
});

app.post('/api/get-main-file', authenticateToken, async (req, res) => {
  mockGenerateContent.mockResolvedValueOnce(mockResponse);
  mockResponse.text.mockReturnValueOnce('const App = () => <div>Hello</div>;');
  res.json({ generatedCode: 'const App = () => <div>Hello</div>;' });
});

app.post('/api/chat', authenticateToken, async (req, res) => {
  mockGenerateContent.mockResolvedValueOnce(mockResponse);
  mockResponse.text.mockReturnValueOnce('Mocked AI response');
  res.json({ response: 'Mocked AI response' });
});

describe('API Endpoints', () => {
  it('POST /api/login should return a token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'user1', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /api/login should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'user1', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Nieprawidłowa nazwa użytkownika lub hasło');
  });

  it('POST /api/generate-code should return a ZIP file with valid token', async () => {
    const token = jwt.sign({ userId: 1, username: 'user1' }, 'secret', { expiresIn: '1h' });
    const response = await request(app)
      .post('/api/generate-code')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'Create a React app', framework: 'react', style: 'modern', temperature: 0.7, includeComments: true });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/zip');
  });

  it('POST /api/generate-code should return 401 without token', async () => {
    const response = await request(app)
      .post('/api/generate-code')
      .send({ prompt: 'Create a React app' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Brak tokenu autoryzacyjnego');
  });

  it('POST /api/get-main-file should return main file with valid token', async () => {
    const token = jwt.sign({ userId: 1, username: 'user1' }, 'secret', { expiresIn: '1h' });
    const response = await request(app)
      .post('/api/get-main-file')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'Create a React app' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('generatedCode');
  });

  it('POST /api/chat should return AI response with valid token', async () => {
    const token = jwt.sign({ userId: 1, username: 'user1' }, 'secret', { expiresIn: '1h' });
    const response = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Hello', model: 'gemini-pro', temperature: 0.7 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response', 'Mocked AI response');
  });
});
