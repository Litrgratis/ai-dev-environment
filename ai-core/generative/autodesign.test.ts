import { AutodesignCore } from './autodesign';
describe('AutodesignCore', () => {
  it('should generate React component code', async () => {
    const core = new AutodesignCore('test-key');
    // Mock generative model
    core['genAI'] = {
      getGenerativeModel: () => ({
        generateContent: async () => ({ response: { text: () => '<button>Click</button>' } })
      })
    };
    const code = await core.generateComponent('Button z propsami: text, onClick', 'react');
    expect(code).toContain('button');
  });

  it('should iterate design with feedback', async () => {
    const core = new AutodesignCore('test-key');
    core['genAI'] = {
      getGenerativeModel: () => ({
        generateContent: async () => ({ response: { text: () => '<button>Poprawiony</button>' } })
      })
    };
    const code = await core.iterateDesign('Button', 'Dodaj styl CSS', 'react');
    expect(code).toContain('Poprawiony');
  });
});
