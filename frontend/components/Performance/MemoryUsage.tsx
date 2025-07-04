import React from 'react';

type MemoryUsageProps = {
    memory: number;
};

export const MemoryUsage: React.FC<MemoryUsageProps> = ({ memory }) => (
    <div>Memory Usage: {memory} MB</div>
);
