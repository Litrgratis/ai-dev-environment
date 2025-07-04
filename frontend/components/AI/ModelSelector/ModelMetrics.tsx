import React from 'react';

type ModelMetricsProps = {
    metrics: Record<string, number>;
};

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ metrics }) => (
    <ul>
        {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
