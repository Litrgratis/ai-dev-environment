import React from 'react';

type CIIntegrationProps = {
    onIntegrate: () => void;
    status: string;
};

export const CIIntegration: React.FC<CIIntegrationProps> = ({ onIntegrate, status }) => (
    <div>
        <button onClick={onIntegrate}>Integrate CI</button>
        <span>Status: {status}</span>
    </div>
);
