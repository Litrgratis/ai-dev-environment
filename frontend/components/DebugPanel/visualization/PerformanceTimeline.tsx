import React from 'react';

type PerformanceTimelineProps = {
    events: { label: string; time: number }[];
};

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({ events }) => (
    <ul>
        {events.map((e, idx) => (
            <li key={idx}>{e.label}: {e.time}ms</li>
        ))}
    </ul>
);
