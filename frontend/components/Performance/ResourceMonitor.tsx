import React from 'react';

type ResourceMonitorProps = {
    cpu: number;
    memory: number;
};

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ cpu, memory }) => (
    <div>
        <div>CPU Usage: {cpu}%</div>
        <div>Memory Usage: {memory} MB</div>
    </div>
);
