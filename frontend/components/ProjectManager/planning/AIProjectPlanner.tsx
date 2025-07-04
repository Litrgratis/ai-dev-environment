import React from 'react';

type AIProjectPlannerProps = {
    onPlan: (requirements: string) => void;
};

export const AIProjectPlanner: React.FC<AIProjectPlannerProps> = ({ onPlan }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Project requirements"
                rows={4}
            />
            <button onClick={() => onPlan(input)}>Plan Project</button>
        </div>
    );
};
