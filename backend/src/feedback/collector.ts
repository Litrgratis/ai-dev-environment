import fs from 'fs';
import path from 'path';

const FEEDBACK_LOG = path.join(__dirname, '../../logs/feedback.log');

export class FeedbackCollector {
  static collect(feedback: any) {
    const entry = { ...feedback, timestamp: new Date().toISOString() };
    fs.appendFileSync(FEEDBACK_LOG, JSON.stringify(entry) + '\n');
  }

  static getAll() {
    if (!fs.existsSync(FEEDBACK_LOG)) return [];
    return fs.readFileSync(FEEDBACK_LOG, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));
  }
}
