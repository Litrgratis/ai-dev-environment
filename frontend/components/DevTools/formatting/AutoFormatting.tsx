import React from 'react';

type AutoFormattingProps = {
    enabled: boolean;
    onToggle: () => void;
};

export const AutoFormatting: React.FC<AutoFormattingProps> = ({ enabled, onToggle }) => (
    <button onClick={onToggle}>
        {enabled ? 'Disable Auto Formatting' : 'Enable Auto Formatting'}
    </button>
);
