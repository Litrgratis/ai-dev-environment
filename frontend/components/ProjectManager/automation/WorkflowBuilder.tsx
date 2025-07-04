import React from 'react';

type WorkflowBuilderProps = {
    steps: string[];
    onAdd: (step: string) => void;
};

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ steps, onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {steps.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New step"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Step</button>
        </div>
    );
};
