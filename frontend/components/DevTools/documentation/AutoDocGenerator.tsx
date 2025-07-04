import React from 'react';

type AutoDocGeneratorProps = {
    onGenerate: () => void;
    docs: string[];
};

export const AutoDocGenerator: React.FC<AutoDocGeneratorProps> = ({ onGenerate, docs }) => (
    <div>
        <button onClick={onGenerate}>Generate Documentation</button>
        <ul>
            {docs.map((d, idx) => <li key={idx}>{d}</li>)}
        </ul>
    </div>
);
