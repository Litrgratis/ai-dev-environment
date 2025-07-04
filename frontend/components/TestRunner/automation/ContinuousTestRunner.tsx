import React from 'react';

type ContinuousTestRunnerProps = {
    running: boolean;
    onToggle: () => void;
};

export const ContinuousTestRunner: React.FC<ContinuousTestRunnerProps> = ({ running, onToggle }) => (
    <button onClick={onToggle}>
        {running ? 'Stop Continuous Testing' : 'Start Continuous Testing'}
    </button>
);
