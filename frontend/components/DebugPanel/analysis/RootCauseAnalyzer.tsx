import React from 'react';

type RootCauseAnalyzerProps = {
    causes: string[];
};

export const RootCauseAnalyzer: React.FC<RootCauseAnalyzerProps> = ({ causes }) => (
    <ul>
        {causes.map((c, idx) => <li key={idx}>{c}</li>)}
    </ul>
);
