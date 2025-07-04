import React from 'react';

type CustomLintersProps = {
    linters: string[];
    onRun: (linter: string) => void;
};

export const CustomLinters: React.FC<CustomLintersProps> = ({ linters, onRun }) => (
    <ul>
        {linters.map(l => (
            <li key={l}>
                {l} <button onClick={() => onRun(l)}>Run</button>
            </li>
        ))}
    </ul>
);
