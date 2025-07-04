import React from 'react';

type CoverageAnalyzerProps = {
    coverage: number;
};

export const CoverageAnalyzer: React.FC<CoverageAnalyzerProps> = ({ coverage }) => (
    <div>Coverage: {coverage}%</div>
);
