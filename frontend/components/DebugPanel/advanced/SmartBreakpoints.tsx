import React from 'react';

type SmartBreakpointsProps = {
    breakpoints: number[];
    onToggle: (line: number) => void;
};

export const SmartBreakpoints: React.FC<SmartBreakpointsProps> = ({ breakpoints, onToggle }) => (
    <ul>
        {breakpoints.map(line => (
            <li key={line}>
                Line {line} <button onClick={() => onToggle(line)}>Toggle</button>
            </li>
        ))}
    </ul>
);
