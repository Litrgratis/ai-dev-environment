import React from 'react';

type RegressionTesterProps = {
    onRun: () => void;
    results: string[];
};

export const RegressionTester: React.FC<RegressionTesterProps> = ({ onRun, results }) => (
    <div>
        <button onClick={onRun}>Run Regression Tests</button>
        <ul>
            {results.map((r, idx) => <li key={idx}>{r}</li>)}
        </ul>
    </div>
);
