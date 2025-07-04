import React from 'react';

type PerformanceHintsProps = {
    hints: string[];
};

export const PerformanceHints: React.FC<PerformanceHintsProps> = ({ hints }) => (
    <ul>
        {hints.map((hint, idx) => <li key={idx}>{hint}</li>)}
    </ul>
);
