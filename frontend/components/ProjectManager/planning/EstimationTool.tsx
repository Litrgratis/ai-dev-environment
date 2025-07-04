import React from 'react';

type EstimationToolProps = {
    onEstimate: (task: string, estimate: number) => void;
};

export const EstimationTool: React.FC<EstimationToolProps> = ({ onEstimate }) => {
    const [task, setTask] = React.useState('');
    const [estimate, setEstimate] = React.useState(1);
    return (
        <div>
            <input
                value={task}
                onChange={e => setTask(e.target.value)}
                placeholder="Task"
            />
            <input
                type="number"
                value={estimate}
                onChange={e => setEstimate(Number(e.target.value))}
                min={1}
            />
            <button onClick={() => { onEstimate(task, estimate); setTask(''); setEstimate(1); }}>Estimate</button>
        </div>
    );
};
