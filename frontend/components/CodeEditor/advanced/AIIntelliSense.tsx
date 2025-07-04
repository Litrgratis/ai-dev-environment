import React from 'react';

type AIIntelliSenseProps = {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
};

export const AIIntelliSense: React.FC<AIIntelliSenseProps> = ({ suggestions, onSelect }) => (
    <ul>
        {suggestions.map(s => (
            <li key={s} onClick={() => onSelect(s)}>{s}</li>
        ))}
    </ul>
);
