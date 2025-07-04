import React from 'react';

type CommandHistoryProps = {
    history: string[];
    onReplay: (cmd: string) => void;
};

export const CommandHistory: React.FC<CommandHistoryProps> = ({ history, onReplay }) => (
    <ul>
        {history.map((cmd, idx) => (
            <li key={idx}>
                {cmd} <button onClick={() => onReplay(cmd)}>Replay</button>
            </li>
        ))}
    </ul>
);
