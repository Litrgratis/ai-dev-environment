import React from 'react';

type ModelSettingsProps = {
    settings: Record<string, any>;
    onChange: (key: string, value: any) => void;
};

export const ModelSettings: React.FC<ModelSettingsProps> = ({ settings, onChange }) => (
    <div>
        {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
                <label>{key}</label>
                <input
                    value={value}
                    onChange={e => onChange(key, e.target.value)}
                />
            </div>
        ))}
    </div>
);
