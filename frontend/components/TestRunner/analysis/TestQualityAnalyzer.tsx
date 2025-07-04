import React from 'react';

type TestQualityAnalyzerProps = {
    quality: string;
};

export const TestQualityAnalyzer: React.FC<TestQualityAnalyzerProps> = ({ quality }) => (
    <div>Test Quality: {quality}</div>
);
