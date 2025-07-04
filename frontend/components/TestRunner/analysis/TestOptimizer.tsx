import React from 'react';

type TestOptimizerProps = {
    suggestions: string[];
    onApply: (suggestion: string) => void;
};

export const TestOptimizer: React.FC<TestOptimizerProps> = ({ suggestions, onApply }) => (
    <ul>
        {suggestions.map((s, idx) => (
            <li key={idx}>
                {s} <button onClick={() => onApply(s)}>Apply</button>
            </li>
        ))}
    </ul>
);
