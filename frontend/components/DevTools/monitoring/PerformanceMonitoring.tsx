import React from 'react';

type PerformanceMonitoringProps = {
    metrics: Record<string, number>;
};

export const PerformanceMonitoring: React.FC<PerformanceMonitoringProps> = ({ metrics }) => (
    <ul>
        {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
