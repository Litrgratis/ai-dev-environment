import React from 'react';

type ExecutionPathAnalyzerProps = {
    paths: string[];
};

export const ExecutionPathAnalyzer: React.FC<ExecutionPathAnalyzerProps> = ({ paths }) => (
    <ul>
        {paths.map((p, idx) => <li key={idx}>{p}</li>)}
    </ul>
);
