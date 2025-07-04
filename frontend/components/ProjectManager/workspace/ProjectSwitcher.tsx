import React from 'react';

type ProjectSwitcherProps = {
    projects: string[];
    selected: string;
    onSwitch: (project: string) => void;
};

export const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({ projects, selected, onSwitch }) => (
    <select value={selected} onChange={e => onSwitch(e.target.value)}>
        {projects.map(p => (
            <option key={p} value={p}>{p}</option>
        ))}
    </select>
);
