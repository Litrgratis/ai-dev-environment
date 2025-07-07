class Auditor {
  async checkAccess({ token }) {
    if (token === 'invalid') return { status: 'unauthorized', message: 'Invalid token' };
    return { status: 'authorized' };
  }
}

module.exports = { Auditor };
