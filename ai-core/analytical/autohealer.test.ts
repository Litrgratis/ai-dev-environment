import { Autohealer } from './autohealer';
describe('Autohealer', () => {
  it('should detect anomalies', async () => {
    const prometheus = { query: async () => [{ instance: 'srv1', value: 12 }, { instance: 'srv2', value: 5 }] };
    const healer = new Autohealer(prometheus as any);
    const anomalies = await healer.detectAnomalies();
    expect(anomalies).toContain('srv1');
    expect(anomalies).not.toContain('srv2');
  });

  it('should diagnose and plan healing', async () => {
    const prometheus = { query: async () => [] };
    const healer = new Autohealer(prometheus as any);
    const diagnosis = await healer.diagnose('srv1');
    expect(diagnosis).toContain('Wykryto problem');
    const plan = await healer.planHealing('srv1');
    expect(plan).toContain('Plan naprawczy');
  });
});
