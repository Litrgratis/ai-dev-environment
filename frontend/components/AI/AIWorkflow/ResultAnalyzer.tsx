import React from 'react';

type ResultAnalyzerProps = {
    results: string[];
};

export const ResultAnalyzer: React.FC<ResultAnalyzerProps> = ({ results }) => (
    <ul>
        {results.map((r, idx) => <li key={idx}>{r}</li>)}
    </ul>
);
