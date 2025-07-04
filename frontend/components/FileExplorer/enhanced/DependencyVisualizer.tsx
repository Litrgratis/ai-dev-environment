import React from 'react';

type DependencyVisualizerProps = {
    dependencies: string[];
};

export const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({ dependencies }) => (
    <ul>
        {dependencies.map(dep => <li key={dep}>{dep}</li>)}
    </ul>
);
