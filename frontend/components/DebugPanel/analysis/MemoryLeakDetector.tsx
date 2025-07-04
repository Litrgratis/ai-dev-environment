import React from 'react';

type MemoryLeakDetectorProps = {
    leaks: string[];
};

export const MemoryLeakDetector: React.FC<MemoryLeakDetectorProps> = ({ leaks }) => (
    <ul>
        {leaks.map((l, idx) => <li key={idx}>{l}</li>)}
    </ul>
);
