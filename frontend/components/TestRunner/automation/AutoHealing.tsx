import React from 'react';

type AutoHealingProps = {
    enabled: boolean;
    onToggle: () => void;
};

export const AutoHealing: React.FC<AutoHealingProps> = ({ enabled, onToggle }) => (
    <button onClick={onToggle}>
        {enabled ? 'Disable Auto-Healing' : 'Enable Auto-Healing'}
    </button>
);
