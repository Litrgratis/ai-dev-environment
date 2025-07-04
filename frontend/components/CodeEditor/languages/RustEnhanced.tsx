import React from 'react';

type RustEnhancedProps = {
    code: string;
    onChange: (code: string) => void;
};

export const RustEnhanced: React.FC<RustEnhancedProps> = ({ code, onChange }) => (
    <textarea value={code} onChange={e => onChange(e.target.value)} rows={10} />
);
