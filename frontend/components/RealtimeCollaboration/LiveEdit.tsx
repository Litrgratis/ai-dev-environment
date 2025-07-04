import React from 'react';

type LiveEditProps = {
    value: string;
    onChange: (value: string) => void;
};

export const LiveEdit: React.FC<LiveEditProps> = ({ value, onChange }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={10} />
);
