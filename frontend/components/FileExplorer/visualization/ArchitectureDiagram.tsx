import React from 'react';

type ArchitectureDiagramProps = {
    diagram: string;
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ diagram }) => (
    <pre>{diagram}</pre>
);
