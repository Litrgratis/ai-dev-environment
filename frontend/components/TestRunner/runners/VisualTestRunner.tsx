import React from 'react';

type VisualTestRunnerProps = {
    tests: string[];
    onRun: () => void;
    results: string[];
};

export const VisualTestRunner: React.FC<VisualTestRunnerProps> = ({ tests, onRun, results }) => (
    <div>
        <button onClick={onRun}>Run Visual Tests</button>
        <ul>
            {tests.map((t, idx) => <li key={idx}>{t}</li>)}
        </ul>
        <div>
            <h4>Results</h4>
            <ul>
                {results.map((r, idx) => <li key={idx}>{r}</li>)}
            </ul>
        </div>
    </div>
);
