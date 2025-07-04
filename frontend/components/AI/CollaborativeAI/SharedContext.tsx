import React from 'react';

type SharedContextProps = {
    context: string;
    onUpdate: (context: string) => void;
};

export const SharedContext: React.FC<SharedContextProps> = ({ context, onUpdate }) => (
    <textarea value={context} onChange={e => onUpdate(e.target.value)} rows={6} />
);
