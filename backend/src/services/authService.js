module.exports = {
  login: async (credentials) => {
    // ...login logic...
    return { token: "jwt-token" };
  },
  register: async (userData) => {
    // ...registration logic...
    return { success: true };
  },
};
