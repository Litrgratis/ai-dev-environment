import React from 'react';

type MemoryUsageChartProps = {
    data: number[];
};

export const MemoryUsageChart: React.FC<MemoryUsageChartProps> = ({ data }) => (
    <div>
        {/* Simple bar chart */}
        {data.map((value, idx) => (
            <div key={idx} style={{ background: '#4caf50', width: value, height: 10, margin: 2 }} />
        ))}
    </div>
);
