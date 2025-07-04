import React from 'react';

type MemoryProfilerProps = {
    usage: number;
};

export const MemoryProfiler: React.FC<MemoryProfilerProps> = ({ usage }) => (
    <div>Memory Usage: {usage} MB</div>
);
