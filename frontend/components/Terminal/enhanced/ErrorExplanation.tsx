import React from 'react';

type ErrorExplanationProps = {
    error: string;
    explanation: string;
};

export const ErrorExplanation: React.FC<ErrorExplanationProps> = ({ error, explanation }) => (
    <div>
        <div style={{ color: 'red' }}>Error: {error}</div>
        <div>Explanation: {explanation}</div>
    </div>
);
