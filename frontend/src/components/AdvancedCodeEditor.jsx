import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AdvancedCodeEditor = ({ 
  code, 
  onChange, 
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  showLineNumbers = true,
  autoComplete = true 
}) => {
  const [localCode, setLocalCode] = useState(code || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLocalCode(code || '');
  }, [code]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setLocalCode(newCode);
    onChange?.(newCode);
    
    if (autoComplete) {
      generateSuggestions(newCode);
    }
  };

  const generateSuggestions = (code) => {
    // Simple autocomplete suggestions
    const commonSuggestions = {
      javascript: [
        'console.log',
        'function',
        'const',
        'let',
        'var',
        'if',
        'else',
        'for',
        'while',
        'return',
        'import',
        'export',
        'class',
        'extends',
        'async',
        'await',
        'try',
        'catch'
      ],
      python: [
        'print',
        'def',
        'class',
        'if',
        'else',
        'elif',
        'for',
        'while',
        'import',
        'from',
        'return',
        'try',
        'except',
        'with',
        'as',
        'lambda'
      ],
      react: [
        'useState',
        'useEffect',
        'useContext',
        'useReducer',
        'useCallback',
        'useMemo',
        'useRef',
        'useImperativeHandle',
        'useLayoutEffect',
        'useDebugValue'
      ]
    };

    const currentSuggestions = commonSuggestions[language] || [];
    const lastWord = code.split(/\s+/).pop();
    
    if (lastWord && lastWord.length > 1) {
      const filtered = currentSuggestions.filter(suggestion => 
        suggestion.startsWith(lastWord)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (suggestion) => {
    const words = localCode.split(/\s+/);
    words[words.length - 1] = suggestion;
    const newCode = words.join(' ');
    setLocalCode(newCode);
    onChange?.(newCode);
    setShowSuggestions(false);
  };

  if (readOnly) {
    return (
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        >
          {localCode}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="relative">
      <textarea
        value={localCode}
        onChange={handleCodeChange}
        className={`w-full h-96 p-4 font-mono text-sm ${
          theme === 'dark' 
            ? 'bg-gray-900 text-green-400 border-gray-700' 
            : 'bg-white text-gray-800 border-gray-300'
        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        placeholder={`Enter your ${language} code here...`}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 z-10 w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => insertSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedCodeEditor;
