import React from 'react';

type ConcurrencyAnalyzerProps = {
    issues: string[];
};

export const ConcurrencyAnalyzer: React.FC<ConcurrencyAnalyzerProps> = ({ issues }) => (
    <ul>
        {issues.map((i, idx) => <li key={idx}>{i}</li>)}
    </ul>
);
