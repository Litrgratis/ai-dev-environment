import React from 'react';

type TypeScriptEnhancedProps = {
    code: string;
    onChange: (code: string) => void;
};

export const TypeScriptEnhanced: React.FC<TypeScriptEnhancedProps> = ({ code, onChange }) => (
    <textarea value={code} onChange={e => onChange(e.target.value)} rows={10} />
);
