import React from 'react';

type EdgeCaseGeneratorProps = {
    onGenerate: () => void;
    cases: string[];
};

export const EdgeCaseGenerator: React.FC<EdgeCaseGeneratorProps> = ({ onGenerate, cases }) => (
    <div>
        <button onClick={onGenerate}>Generate Edge Cases</button>
        <ul>
            {cases.map((c, idx) => <li key={idx}>{c}</li>)}
        </ul>
    </div>
);
