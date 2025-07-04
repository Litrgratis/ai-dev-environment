import React from 'react';

type AITestGeneratorProps = {
    onGenerate: () => void;
    generated: string[];
};

export const AITestGenerator: React.FC<AITestGeneratorProps> = ({ onGenerate, generated }) => (
    <div>
        <button onClick={onGenerate}>Generate AI Tests</button>
        <ul>
            {generated.map((g, idx) => <li key={idx}>{g}</li>)}
        </ul>
    </div>
);
