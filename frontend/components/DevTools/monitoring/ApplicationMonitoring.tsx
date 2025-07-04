import React from 'react';

type ApplicationMonitoringProps = {
    status: string;
    onRefresh: () => void;
};

export const ApplicationMonitoring: React.FC<ApplicationMonitoringProps> = ({ status, onRefresh }) => (
    <div>
        <div>Status: {status}</div>
        <button onClick={onRefresh}>Refresh</button>
    </div>
);
