import React from 'react';

type CodeQualityMetricsProps = {
    metrics: Record<string, number>;
};

export const CodeQualityMetrics: React.FC<CodeQualityMetricsProps> = ({ metrics }) => (
    <ul>
        {Object.entries(metrics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
