import React from 'react';

type ContextPanelProps = {
    context: string;
    onChange: (context: string) => void;
};

export const ContextPanel: React.FC<ContextPanelProps> = ({ context, onChange }) => (
    <div>
        <label>Context:</label>
        <textarea value={context} onChange={e => onChange(e.target.value)} rows={4} />
    </div>
);
