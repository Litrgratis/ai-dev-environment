import React from 'react';

type AICodeLensProps = {
    hints: string[];
};

export const AICodeLens: React.FC<AICodeLensProps> = ({ hints }) => (
    <div>
        {hints.map((hint, idx) => (
            <div key={idx} style={{ fontSize: 12, color: '#888' }}>{hint}</div>
        ))}
    </div>
);
