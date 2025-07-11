import React, { useState, useCallback, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import FeedbackDashboard from './FeedbackDashboard';

const IntegratedIDE = () => {
  const [code, setCode] = useState('// Welcome to AI Development Environment\n// Start typing your code here...\n\nfunction example() {\n  console.log("Hello World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [prompt, setPrompt] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState('editor'); // 'editor' or 'feedback'
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      formatOnPaste: true,
      formatOnType: true
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleGenerateCode();
    });
  }, []);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate code');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/pipeline/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          language,
          context: code || '',
          maxIterations: 3,
          includeComments: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setFeedbackData(data.data);
        setCode(data.data.finalCode);
        setCurrentView('feedback');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      setError(`Failed to generate code: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyIteration = (iteration) => {
    setCode(iteration.code);
    setCurrentView('editor');
    
    // Focus the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleClearCode = () => {
    setCode('');
    setFeedbackData(null);
    setError(null);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleExportCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">AI Development Environment</h1>
            <div className="flex items-center space-x-2">
              <label htmlFor="language" className="text-sm font-medium text-gray-700">
                Language:
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView(currentView === 'editor' ? 'feedback' : 'editor')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={!feedbackData}
            >
              {currentView === 'editor' ? 'Show Feedback' : 'Show Editor'}
            </button>
            <button
              onClick={handleClearCode}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleExportCode}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              disabled={!code.trim()}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Prompt and Controls */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                AI Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create... (Ctrl+Enter to generate)"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isGenerating}
              />
            </div>
            
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating || !prompt.trim()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate Code'
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Status Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Use Ctrl+Enter to generate code</p>
              <p>• Switch between editor and feedback views</p>
              <p>• Apply iterations directly to editor</p>
              {feedbackData && (
                <p className="text-green-600">
                  ✓ Generated {feedbackData.iterations?.length || 0} iterations
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Editor or Feedback */}
        <div className="flex-1 flex flex-col">
          {currentView === 'editor' ? (
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={setCode}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  automaticLayout: true,
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                  tabSize: 2,
                  insertSpaces: true
                }}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto bg-white">
              <FeedbackDashboard
                feedbackData={feedbackData}
                onApplyIteration={handleApplyIteration}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegratedIDE;
