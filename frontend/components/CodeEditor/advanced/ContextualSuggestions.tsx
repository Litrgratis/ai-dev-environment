import React from 'react';

type ContextualSuggestionsProps = {
    suggestions: string[];
    onApply: (suggestion: string) => void;
};

export const ContextualSuggestions: React.FC<ContextualSuggestionsProps> = ({ suggestions, onApply }) => (
    <ul>
        {suggestions.map(s => (
            <li key={s}>
                {s} <button onClick={() => onApply(s)}>Apply</button>
            </li>
        ))}
    </ul>
);
