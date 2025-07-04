import React from 'react';

type KubernetesDeploymentProps = {
    onDeploy: () => void;
    status: string;
};

export const KubernetesDeployment: React.FC<KubernetesDeploymentProps> = ({ onDeploy, status }) => (
    <div>
        <button onClick={onDeploy}>Deploy to Kubernetes</button>
        <span>Status: {status}</span>
    </div>
);
