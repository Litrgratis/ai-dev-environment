import React from 'react';

type TestCaseGeneratorProps = {
    onGenerate: () => void;
    cases: string[];
};

export const TestCaseGenerator: React.FC<TestCaseGeneratorProps> = ({ onGenerate, cases }) => (
    <div>
        <button onClick={onGenerate}>Generate Test Cases</button>
        <ul>
            {cases.map((c, idx) => <li key={idx}>{c}</li>)}
        </ul>
    </div>
);
