import React from 'react';

type PrettierIntegrationProps = {
    onFormat: () => void;
};

export const PrettierIntegration: React.FC<PrettierIntegrationProps> = ({ onFormat }) => (
    <button onClick={onFormat}>Format with Prettier</button>
);
