import React from 'react';

type TrendAnalysisProps = {
    trends: string[];
};

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trends }) => (
    <ul>
        {trends.map((t, idx) => <li key={idx}>{t}</li>)}
    </ul>
);
