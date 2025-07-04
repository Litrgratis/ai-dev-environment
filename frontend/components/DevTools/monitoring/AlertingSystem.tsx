import React from 'react';

type AlertingSystemProps = {
    alerts: string[];
    onAcknowledge: (alert: string) => void;
};

export const AlertingSystem: React.FC<AlertingSystemProps> = ({ alerts, onAcknowledge }) => (
    <ul>
        {alerts.map((a, idx) => (
            <li key={idx}>
                {a} <button onClick={() => onAcknowledge(a)}>Acknowledge</button>
            </li>
        ))}
    </ul>
);
