import React from 'react';

type SessionManagerProps = {
    sessions: string[];
    onSwitch: (id: string) => void;
    onClose: (id: string) => void;
};

export const SessionManager: React.FC<SessionManagerProps> = ({ sessions, onSwitch, onClose }) => (
    <ul>
        {sessions.map(id => (
            <li key={id}>
                <button onClick={() => onSwitch(id)}>{id}</button>
                <button onClick={() => onClose(id)}>Close</button>
            </li>
        ))}
    </ul>
);
