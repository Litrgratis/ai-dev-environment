import React from 'react';

type SecurityAnnotationsProps = {
    annotations: string[];
};

export const SecurityAnnotations: React.FC<SecurityAnnotationsProps> = ({ annotations }) => (
    <ul>
        {annotations.map((a, idx) => (
            <li key={idx} style={{ color: 'red' }}>{a}</li>
        ))}
    </ul>
);
