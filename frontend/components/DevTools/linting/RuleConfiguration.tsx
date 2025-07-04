import React from 'react';

type RuleConfigurationProps = {
    rules: Record<string, string>;
    onChange: (rule: string, value: string) => void;
};

export const RuleConfiguration: React.FC<RuleConfigurationProps> = ({ rules, onChange }) => (
    <div>
        {Object.entries(rules).map(([rule, value]) => (
            <div key={rule}>
                <label>{rule}</label>
                <input value={value} onChange={e => onChange(rule, e.target.value)} />
            </div>
        ))}
    </div>
);
