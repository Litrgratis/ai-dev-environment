exports.getProfile = (req, res) => {
  // ...implement user profile logic...
  res.send({ user: { id: 1, name: "Test User" } });
};
