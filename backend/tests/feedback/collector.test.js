import { FeedbackCollector } from '../../../src/feedback/collector';
describe('FeedbackCollector', () => {
  it('collects and retrieves feedback', () => {
    const feedback = { score: 80, comments: 'ok' };
    FeedbackCollector.collect(feedback);
    const all = FeedbackCollector.getAll();
    expect(all[all.length - 1].score).toBe(80);
  });
});
