import React from 'react';

type IntegrationTestRunnerProps = {
    tests: string[];
    onRun: () => void;
    results: string[];
};

export const IntegrationTestRunner: React.FC<IntegrationTestRunnerProps> = ({ tests, onRun, results }) => (
    <div>
        <button onClick={onRun}>Run Integration Tests</button>
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
