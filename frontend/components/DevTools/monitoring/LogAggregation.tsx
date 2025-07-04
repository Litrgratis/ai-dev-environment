import React from 'react';

type LogAggregationProps = {
    logs: string[];
    onRefresh: () => void;
};

export const LogAggregation: React.FC<LogAggregationProps> = ({ logs, onRefresh }) => (
    <div>
        <button onClick={onRefresh}>Refresh Logs</button>
        <ul>
            {logs.map((l, idx) => <li key={idx}>{l}</li>)}
        </ul>
    </div>
);
