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

export default function AIChat({ onCodeGeneration, isGenerating }) {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMessage = { type: 'user', content: prompt, timestamp: new Date() };
    setChatHistory(prev => [...prev, newMessage]);
    
    setError(null);
    
    try {
      // Call the parent component's code generation handler
      await onCodeGeneration(prompt, language);
      
      const aiMessage = { 
        type: 'ai', 
        content: `Generated ${language} code for: "${prompt}"`, 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, aiMessage]);
      
      setPrompt('');
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      const errorMessage = { 
        type: 'error', 
        content: 'Failed to generate code. Please try again.', 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
  };

  const quickPrompts = [
    'Create a function to sort an array',
    'Build a REST API endpoint',
    'Implement a binary search algorithm',
    'Create a responsive navbar component',
    'Write a file upload handler'
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Start a conversation with the AI assistant!</p>
            <p className="text-sm mt-2">Describe what code you want to generate.</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Prompts:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(quickPrompt)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition-colors"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what code you want to generate..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={isGenerating || !prompt.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-100 border-t border-red-300 text-red-800 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
