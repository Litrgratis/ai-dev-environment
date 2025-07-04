import React from 'react';

type E2ETestRunnerProps = {
    tests: string[];
    onRun: () => void;
    results: string[];
};

export const E2ETestRunner: React.FC<E2ETestRunnerProps> = ({ tests, onRun, results }) => (
    <div>
        <button onClick={onRun}>Run E2E Tests</button>
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
