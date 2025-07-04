import React from 'react';

type ContainerBuilderProps = {
    onBuild: () => void;
    status: string;
};

export const ContainerBuilder: React.FC<ContainerBuilderProps> = ({ onBuild, status }) => (
    <div>
        <button onClick={onBuild}>Build Container</button>
        <span>Status: {status}</span>
    </div>
);
