import React from 'react';

type EnvironmentManagerProps = {
    environments: string[];
    selected: string;
    onSelect: (env: string) => void;
};

export const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ environments, selected, onSelect }) => (
    <select value={selected} onChange={e => onSelect(e.target.value)}>
        {environments.map(env => (
            <option key={env} value={env}>{env}</option>
        ))}
    </select>
);
