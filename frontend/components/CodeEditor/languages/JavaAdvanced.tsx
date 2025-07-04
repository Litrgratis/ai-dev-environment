import React from 'react';

type JavaAdvancedProps = {
    code: string;
    onChange: (code: string) => void;
};

export const JavaAdvanced: React.FC<JavaAdvancedProps> = ({ code, onChange }) => (
    <textarea value={code} onChange={e => onChange(e.target.value)} rows={10} />
);
