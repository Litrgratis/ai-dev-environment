import React from 'react';

type PerformanceReportProps = {
    performance: string;
};

export const PerformanceReport: React.FC<PerformanceReportProps> = ({ performance }) => (
    <div>Performance: {performance}</div>
);
