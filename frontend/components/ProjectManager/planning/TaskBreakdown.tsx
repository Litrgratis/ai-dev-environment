import React from 'react';

type TaskBreakdownProps = {
    tasks: string[];
    onAdd: (task: string) => void;
};

export const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ tasks, onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {tasks.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New task"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Task</button>
        </div>
    );
};
