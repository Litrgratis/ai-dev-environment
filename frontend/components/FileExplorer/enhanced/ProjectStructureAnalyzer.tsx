import React from 'react';

type ProjectStructureAnalyzerProps = {
    structure: string;
};

export const ProjectStructureAnalyzer: React.FC<ProjectStructureAnalyzerProps> = ({ structure }) => (
    <pre>{structure}</pre>
);
