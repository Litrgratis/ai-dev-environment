import React from 'react';

type SonarLintIntegrationProps = {
    issues: string[];
    onScan: () => void;
};

export const SonarLintIntegration: React.FC<SonarLintIntegrationProps> = ({ issues, onScan }) => (
    <div>
        <button onClick={onScan}>Run SonarLint</button>
        <ul>
            {issues.map((i, idx) => <li key={idx}>{i}</li>)}
        </ul>
    </div>
);
