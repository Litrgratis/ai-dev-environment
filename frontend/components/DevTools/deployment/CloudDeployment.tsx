import React from 'react';

type CloudDeploymentProps = {
    onDeploy: () => void;
    status: string;
};

export const CloudDeployment: React.FC<CloudDeploymentProps> = ({ onDeploy, status }) => (
    <div>
        <button onClick={onDeploy}>Deploy to Cloud</button>
        <span>Status: {status}</span>
    </div>
);
