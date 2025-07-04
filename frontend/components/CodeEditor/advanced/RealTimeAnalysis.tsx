import React from 'react';

type RealTimeAnalysisProps = {
    analysis: string;
};

export const RealTimeAnalysis: React.FC<RealTimeAnalysisProps> = ({ analysis }) => (
    <pre>{analysis}</pre>
);
