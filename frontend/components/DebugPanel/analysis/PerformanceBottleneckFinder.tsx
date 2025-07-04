import React from 'react';

type PerformanceBottleneckFinderProps = {
    bottlenecks: string[];
};

export const PerformanceBottleneckFinder: React.FC<PerformanceBottleneckFinderProps> = ({ bottlenecks }) => (
    <ul>
        {bottlenecks.map((b, idx) => <li key={idx}>{b}</li>)}
    </ul>
);
