import React from 'react';

type Task = { id: string; title: string };

type TaskPlannerProps = {
    tasks: Task[];
    onAddTask: (title: string) => void;
};

export const TaskPlanner: React.FC<TaskPlannerProps> = ({ tasks, onAddTask }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {tasks.map(t => <li key={t.id}>{t.title}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New task"
            />
            <button onClick={() => { onAddTask(input); setInput(''); }}>Add Task</button>
        </div>
    );
};
