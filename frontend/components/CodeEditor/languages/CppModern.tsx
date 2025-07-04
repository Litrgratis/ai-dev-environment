import React from 'react';

type CppModernProps = {
    code: string;
    onChange: (code: string) => void;
};

export const CppModern: React.FC<CppModernProps> = ({ code, onChange }) => (
    <textarea value={code} onChange={e => onChange(e.target.value)} rows={10} />
);
