import React from 'react';

type MultiProjectWorkspaceProps = {
    projects: string[];
    onSelect: (project: string) => void;
};

export const MultiProjectWorkspace: React.FC<MultiProjectWorkspaceProps> = ({ projects, onSelect }) => (
    <ul>
        {projects.map(p => (
            <li key={p}>
                <button onClick={() => onSelect(p)}>{p}</button>
            </li>
        ))}
    </ul>
);
