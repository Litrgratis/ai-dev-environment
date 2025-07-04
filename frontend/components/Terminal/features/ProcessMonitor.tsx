import React from 'react';

type Process = { pid: number; name: string; status: string };

type ProcessMonitorProps = {
    processes: Process[];
    onKill: (pid: number) => void;
};

export const ProcessMonitor: React.FC<ProcessMonitorProps> = ({ processes, onKill }) => (
    <ul>
        {processes.map(proc => (
            <li key={proc.pid}>
                {proc.name} (PID: {proc.pid}) - {proc.status}
                <button onClick={() => onKill(proc.pid)}>Kill</button>
            </li>
        ))}
    </ul>
);
