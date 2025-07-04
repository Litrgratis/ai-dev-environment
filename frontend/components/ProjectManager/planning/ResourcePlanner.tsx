import React from 'react';

type ResourcePlannerProps = {
    resources: string[];
    onAdd: (resource: string) => void;
};

export const ResourcePlanner: React.FC<ResourcePlannerProps> = ({ resources, onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {resources.map((r, idx) => <li key={idx}>{r}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New resource"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Resource</button>
        </div>
    );
};
