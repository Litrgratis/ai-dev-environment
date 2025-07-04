import React from 'react';

type CoverageReportProps = {
    coverage: number;
};

export const CoverageReport: React.FC<CoverageReportProps> = ({ coverage }) => (
    <div>Coverage: {coverage}%</div>
);
