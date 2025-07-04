import React from 'react';

type DistributedTracingProps = {
    traces: string[];
};

export const DistributedTracing: React.FC<DistributedTracingProps> = ({ traces }) => (
    <ul>
        {traces.map((t, idx) => <li key={idx}>{t}</li>)}
    </ul>
);
