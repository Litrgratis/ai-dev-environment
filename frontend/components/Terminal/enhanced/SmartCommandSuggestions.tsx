import React from 'react';

type SmartCommandSuggestionsProps = {
    suggestions: string[];
    onSelect: (cmd: string) => void;
};

export const SmartCommandSuggestions: React.FC<SmartCommandSuggestionsProps> = ({ suggestions, onSelect }) => (
    <ul>
        {suggestions.map(s => (
            <li key={s}>
                {s} <button onClick={() => onSelect(s)}>Use</button>
            </li>
        ))}
    </ul>
);
