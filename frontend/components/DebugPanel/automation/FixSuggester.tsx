import React from 'react';

type FixSuggesterProps = {
    suggestions: string[];
    onApply: (suggestion: string) => void;
};

export const FixSuggester: React.FC<FixSuggesterProps> = ({ suggestions, onApply }) => (
    <ul>
        {suggestions.map((s, idx) => (
            <li key={idx}>
                {s} <button onClick={() => onApply(s)}>Apply</button>
            </li>
        ))}
    </ul>
);
