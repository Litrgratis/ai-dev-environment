import React from 'react';

type KeyBindingsProps = {
    bindings: Record<string, string>;
    onChange: (key: string, value: string) => void;
};

export const KeyBindings: React.FC<KeyBindingsProps> = ({ bindings, onChange }) => (
    <div>
        {Object.entries(bindings).map(([key, value]) => (
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
