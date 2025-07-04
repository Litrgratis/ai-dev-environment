import React from 'react';

type PerformanceMetricsProps = {
    metrics: Record<string, number>;
};

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => (
    <ul>
        {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
