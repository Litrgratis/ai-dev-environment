import React from 'react';

type GoSmartProps = {
    code: string;
    onChange: (code: string) => void;
};

export const GoSmart: React.FC<GoSmartProps> = ({ code, onChange }) => (
    <textarea value={code} onChange={e => onChange(e.target.value)} rows={10} />
);
