import React from 'react';

type SecurityWarningsProps = {
    warnings: string[];
};

export const SecurityWarnings: React.FC<SecurityWarningsProps> = ({ warnings }) => (
    <ul>
        {warnings.map(warning => (
            <li key={warning} style={{ color: 'red' }}>{warning}</li>
        ))}
    </ul>
);
