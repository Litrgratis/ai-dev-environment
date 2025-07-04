import React from 'react';

type SmartBracketsProps = {
    enabled: boolean;
    onToggle: () => void;
};

export const SmartBrackets: React.FC<SmartBracketsProps> = ({ enabled, onToggle }) => (
    <button onClick={onToggle}>
        {enabled ? 'Disable Smart Brackets' : 'Enable Smart Brackets'}
    </button>
);
