import React from 'react';

type TestMetricsProps = {
    metrics: Record<string, number>;
};

export const TestMetrics: React.FC<TestMetricsProps> = ({ metrics }) => (
    <ul>
        {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
