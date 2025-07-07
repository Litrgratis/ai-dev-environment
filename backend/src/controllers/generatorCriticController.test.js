const request = require('supertest');
const express = require('express');
const generatorCriticController = require('../controllers/generatorCriticController');

const app = express();
app.use(express.json());
app.post('/pipeline/generator-critic', generatorCriticController.generatorCritic);

describe('POST /pipeline/generator-critic', () => {
  it('returns mock Generator-Critic result for JS', async () => {
    const res = await request(app)
      .post('/pipeline/generator-critic')
      .send({ prompt: 'Add two numbers', language: 'javascript' });
    expect(res.statusCode).toBe(200);
    expect(res.body.finalCode).toContain('javascript code v3');
    expect(res.body.iterations.length).toBe(3);
  });

  it('returns 400 for missing prompt', async () => {
    const res = await request(app)
      .post('/pipeline/generator-critic')
      .send({ language: 'python' });
    expect(res.statusCode).toBe(400);
  });

  it('returns mock Generator-Critic result for Java', async () => {
    const res = await request(app)
      .post('/pipeline/generator-critic')
      .send({ prompt: 'Sort array', language: 'java' });
    expect(res.statusCode).toBe(200);
    expect(res.body.finalCode).toContain('java code v3');
    expect(res.body.iterations.length).toBe(3);
  });
});
