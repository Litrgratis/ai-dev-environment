import React from 'react';

type CallStackVisualizerProps = {
    stack: string[];
};

export const CallStackVisualizer: React.FC<CallStackVisualizerProps> = ({ stack }) => (
    <ol>
        {stack.map((s, idx) => <li key={idx}>{s}</li>)}
    </ol>
);
