import React from 'react';

type UnitTestRunnerProps = {
    tests: string[];
    onRun: () => void;
    results: string[];
};

export const UnitTestRunner: React.FC<UnitTestRunnerProps> = ({ tests, onRun, results }) => (
    <div>
        <button onClick={onRun}>Run Unit Tests</button>
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
