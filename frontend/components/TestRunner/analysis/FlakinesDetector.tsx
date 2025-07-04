import React from 'react';

type FlakinesDetectorProps = {
    flakyTests: string[];
};

export const FlakinesDetector: React.FC<FlakinesDetectorProps> = ({ flakyTests }) => (
    <div>
        <h4>Flaky Tests</h4>
        <ul>
            {flakyTests.map((t, idx) => <li key={idx}>{t}</li>)}
        </ul>
    </div>
);
