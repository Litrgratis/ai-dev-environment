import React from 'react';

type RegressionPreventerProps = {
    enabled: boolean;
    onToggle: () => void;
};

export const RegressionPreventer: React.FC<RegressionPreventerProps> = ({ enabled, onToggle }) => (
    <button onClick={onToggle}>
        {enabled ? 'Disable Regression Prevention' : 'Enable Regression Prevention'}
    </button>
);
