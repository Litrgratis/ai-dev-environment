import React from 'react';

type ExecutionTimerProps = {
    timeMs: number;
};

export const ExecutionTimer: React.FC<ExecutionTimerProps> = ({ timeMs }) => (
    <div>Execution Time: {timeMs} ms</div>
);
