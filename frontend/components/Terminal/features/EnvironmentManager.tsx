import React from 'react';

type EnvironmentManagerProps = {
    variables: Record<string, string>;
    onSet: (key: string, value: string) => void;
};

export const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ variables, onSet }) => (
    <div>
        {Object.entries(variables).map(([key, value]) => (
            <div key={key}>
                <label>{key}</label>
                <input
                    value={value}
                    onChange={e => onSet(key, e.target.value)}
                />
            </div>
        ))}
    </div>
);
