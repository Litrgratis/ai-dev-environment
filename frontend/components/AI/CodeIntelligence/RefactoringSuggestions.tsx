import React from 'react';

type RefactoringSuggestionsProps = {
    suggestions: string[];
    onRefactor: (suggestion: string) => void;
};

export const RefactoringSuggestions: React.FC<RefactoringSuggestionsProps> = ({ suggestions, onRefactor }) => (
    <ul>
        {suggestions.map(s => (
            <li key={s}>
                {s} <button onClick={() => onRefactor(s)}>Refactor</button>
            </li>
        ))}
    </ul>
);
