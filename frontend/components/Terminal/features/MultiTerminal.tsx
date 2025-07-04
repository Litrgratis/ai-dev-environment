import React from 'react';

type MultiTerminalProps = {
    terminals: string[];
    onSelect: (id: string) => void;
    onNew: () => void;
};

export const MultiTerminal: React.FC<MultiTerminalProps> = ({ terminals, onSelect, onNew }) => (
    <div>
        <ul>
            {terminals.map(id => (
                <li key={id}>
                    <button onClick={() => onSelect(id)}>{id}</button>
                </li>
            ))}
        </ul>
        <button onClick={onNew}>New Terminal</button>
    </div>
);
