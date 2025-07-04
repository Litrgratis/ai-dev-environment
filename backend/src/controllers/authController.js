exports.login = (req, res) => {
  // ...implement login logic...
  res.send({ token: 'jwt-token' });
};

exports.register = (req, res) => {
  // ...implement registration logic...
  res.send({ success: true });
};
