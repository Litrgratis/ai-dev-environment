const express = require('express');
const app = express();

app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/ai', require('./routes/ai'));
app.use('/users', require('./routes/users'));

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
