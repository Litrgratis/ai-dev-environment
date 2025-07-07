const express = require('express');
const app = express();
const { register } = require('./monitoring/metrics');

app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/ai', require('./routes/ai'));
app.use('/users', require('./routes/users'));

app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
