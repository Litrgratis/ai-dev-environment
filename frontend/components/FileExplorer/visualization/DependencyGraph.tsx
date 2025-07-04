import React from 'react';

type Dependency = { from: string; to: string };

type DependencyGraphProps = {
    dependencies: Dependency[];
};

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ dependencies }) => (
    <ul>
        {dependencies.map((dep, idx) => (
            <li key={idx}>{dep.from} → {dep.to}</li>
        ))}
    </ul>
);
