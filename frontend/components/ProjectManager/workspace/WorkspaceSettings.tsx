import React from 'react';

type WorkspaceSettingsProps = {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
};

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ settings, onChange }) => (
    <div>
        {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
                <label>{key}</label>
                <input value={value} onChange={e => onChange(key, e.target.value)} />
            </div>
        ))}
    </div>
);
