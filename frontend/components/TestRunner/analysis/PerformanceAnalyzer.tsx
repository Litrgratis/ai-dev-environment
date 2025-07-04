import React from 'react';

type PerformanceAnalyzerProps = {
    performance: string;
};

export const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ performance }) => (
    <div>Performance: {performance}</div>
);
