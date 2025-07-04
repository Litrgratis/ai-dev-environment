import React from 'react';

type PerformanceTestRunnerProps = {
    tests: string[];
    onRun: () => void;
    results: string[];
};

export const PerformanceTestRunner: React.FC<PerformanceTestRunnerProps> = ({ tests, onRun, results }) => (
    <div>
        <button onClick={onRun}>Run Performance Tests</button>
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
