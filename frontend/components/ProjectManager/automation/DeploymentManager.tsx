import React from 'react';

type DeploymentManagerProps = {
    onDeploy: () => void;
    status: string;
};

export const DeploymentManager: React.FC<DeploymentManagerProps> = ({ onDeploy, status }) => (
    <div>
        <button onClick={onDeploy}>Deploy</button>
        <span>Status: {status}</span>
    </div>
);
