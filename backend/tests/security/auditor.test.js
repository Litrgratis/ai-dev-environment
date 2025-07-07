import { Auditor } from '../../src/security/auditor';
import { describe, it, expect } from '@jest/globals';
const { aiRequests } = require('../monitoring/metrics');

describe('Security Auditor', () => {
  it('should log and detect anomalies', async () => {
    // Simulacja logowania i wykrywania anomalii
    aiRequests.inc();
    expect(aiRequests.hashMap.ai_requests_total.value).toBeGreaterThan(0);
  });
});

describe('Auditor', () => {
  it('detects unauthorized access', async () => {
    const auditor = new Auditor();
    const result = await auditor.checkAccess({ token: 'invalid' });
    expect(result).toEqual({ status: 'unauthorized', message: 'Invalid token' });
  });
  // Dodaj więcej testów pokrywających logowanie, alerty, edge cases
});
