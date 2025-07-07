import React, { useState } from 'react';

const callPipelineAPI = async (prompt, language) => {
  const res = await fetch('/pipeline/generator-critic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language })
  });
  if (!res.ok) throw new Error('Pipeline error');
  return await res.json();
};

export default function AIChat() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await callPipelineAPI(prompt, language);
      setResult(res);
    } catch (err) {
      setError('Błąd backendu lub połączenia.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>AI Generator-Critic Chat</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your coding task or requirements..."
          rows={4}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Processing...' : 'Run Generator-Critic'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {result && (
        <div>
          <h3>Final Code</h3>
          <pre style={{ background: '#f4f4f4', padding: 12 }}>{result.finalCode}</pre>
          <h4>Feedback Iterations</h4>
          <ol>
            {result.iterations.map(it => (
              <li key={it.iteration}>
                <b>Iteration {it.iteration}:</b>
                <pre style={{ background: '#fafafa', padding: 8 }}>{it.code}</pre>
                <div style={{ color: '#555' }}>Feedback: {it.feedback}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
