import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FeedbackDashboard = ({ feedbackData, onApplyIteration }) => {
  if (!feedbackData || !feedbackData.iterations) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No feedback data available</p>
        <p className="text-sm mt-2">Generate code using the AI assistant to see feedback iterations.</p>
      </div>
    );
  }

  const { iterations, finalCode } = feedbackData;

  return (
    <div className="p-4 space-y-4">
      {/* Final Code Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Final Code</h3>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '12px',
              lineHeight: '1.4'
            }}
          >
            {finalCode}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Iterations Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Iteration History</h3>
        {iterations.map((iteration, index) => (
          <div key={iteration.iteration} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-gray-800">
                Iteration {iteration.iteration}
              </h4>
              <button
                onClick={() => onApplyIteration(iteration)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Apply to Editor
              </button>
            </div>
            
            {/* Code */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Generated Code:</p>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language={iteration.language}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '0.75rem',
                    fontSize: '11px',
                    lineHeight: '1.3'
                  }}
                >
                  {iteration.code}
                </SyntaxHighlighter>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800 mb-1">AI Feedback:</p>
              <p className="text-sm text-yellow-700">{iteration.feedback}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-800 mb-2">Generation Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Iterations:</p>
            <p className="font-semibold">{iterations.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Language:</p>
            <p className="font-semibold">{iterations[0]?.language || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
