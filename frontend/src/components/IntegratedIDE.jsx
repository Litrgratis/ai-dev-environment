import React, { useState, useCallback } from 'react';
import AdvancedCodeEditor from './AdvancedCodeEditor';
import AIChat from './AIChat';
import FeedbackDashboard from './FeedbackDashboard';

const IntegratedIDE = () => {
  const [code, setCode] = useState('// Your code will appear here after AI generation');
  const [language, setLanguage] = useState('javascript');
  const [feedbackData, setFeedbackData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCodeGeneration = useCallback(async (prompt, selectedLanguage) => {
    setIsGenerating(true);
    setLanguage(selectedLanguage);
    
    try {
      const response = await fetch('/pipeline/generator-critic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: selectedLanguage })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate code');
      }
      
      const result = await response.json();
      setCode(result.finalCode);
      setFeedbackData(result);
    } catch (error) {
      console.error('Code generation error:', error);
      setCode('// Error generating code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  const handleApplyIteration = useCallback((iteration) => {
    setCode(iteration.code);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Development Environment</h1>
        <p className="text-gray-600">Integrated Code Editor with AI-Powered Generation</p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Chat */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <AIChat 
              onCodeGeneration={handleCodeGeneration}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Language:</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="typescript">TypeScript</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4">
            <AdvancedCodeEditor
              code={code}
              onChange={handleCodeChange}
              language={language}
              theme="dark"
              showLineNumbers={true}
              autoComplete={true}
            />
          </div>
        </div>

        {/* Right Panel - Feedback Dashboard */}
        <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Feedback & Iterations</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <FeedbackDashboard 
              feedbackData={feedbackData}
              onApplyIteration={handleApplyIteration}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedIDE;
