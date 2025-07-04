import React from 'react';

type PerformanceProfilerProps = {
    metrics: Record<string, number>;
};

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({ metrics }) => (
    <ul>
        {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
