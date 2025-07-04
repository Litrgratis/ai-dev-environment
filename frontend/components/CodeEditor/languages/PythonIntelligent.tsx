import React from 'react';

type PythonIntelligentProps = {
    code: string;
    onChange: (code: string) => void;
};

export const PythonIntelligent: React.FC<PythonIntelligentProps> = ({ code, onChange }) => (
    <textarea value={code} onChange={e => onChange(e.target.value)} rows={10} />
);
