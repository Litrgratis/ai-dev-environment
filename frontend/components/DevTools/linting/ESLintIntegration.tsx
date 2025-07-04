import React from 'react';

type ESLintIntegrationProps = {
    results: string[];
    onRun: () => void;
};

export const ESLintIntegration: React.FC<ESLintIntegrationProps> = ({ results, onRun }) => (
    <div>
        <button onClick={onRun}>Run ESLint</button>
        <ul>
            {results.map((r, idx) => <li key={idx}>{r}</li>)}
        </ul>
    </div>
);
