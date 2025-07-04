import React from 'react';

type ProjectAnalyticsProps = {
    analytics: Record<string, number>;
};

export const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ analytics }) => (
    <ul>
        {Object.entries(analytics).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
);
