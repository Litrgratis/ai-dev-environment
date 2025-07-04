import React from 'react';

type CodeStyleEnforcerProps = {
    onEnforce: () => void;
};

export const CodeStyleEnforcer: React.FC<CodeStyleEnforcerProps> = ({ onEnforce }) => (
    <button onClick={onEnforce}>Enforce Code Style</button>
);
