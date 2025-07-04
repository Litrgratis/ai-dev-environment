import React from 'react';

type ModuleMapProps = {
    modules: string[];
};

export const ModuleMap: React.FC<ModuleMapProps> = ({ modules }) => (
    <ul>
        {modules.map(m => <li key={m}>{m}</li>)}
    </ul>
);
