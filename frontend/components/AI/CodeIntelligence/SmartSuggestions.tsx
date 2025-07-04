import React from 'react';

type SmartSuggestionsProps = {
    suggestions: string[];
    onApply: (suggestion: string) => void;
};

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ suggestions, onApply }) => (
    <ul>
        {suggestions.map(s => (
            <li key={s}>
                {s} <button onClick={() => onApply(s)}>Apply</button>
            </li>
        ))}
    </ul>
);
