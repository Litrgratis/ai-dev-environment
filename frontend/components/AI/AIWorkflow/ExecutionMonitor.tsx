import React from 'react';

type ExecutionMonitorProps = {
    status: string;
    logs: string[];
};

export const ExecutionMonitor: React.FC<ExecutionMonitorProps> = ({ status, logs }) => (
    <div>
        <div>Status: {status}</div>
        <pre style={{ maxHeight: 120, overflowY: 'auto' }}>
            {logs.join('\n')}
        </pre>
    </div>
);
