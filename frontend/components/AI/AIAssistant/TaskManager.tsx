import React from 'react';

type Task = { id: string; title: string; status: string };

type TaskManagerProps = {
    tasks: Task[];
    onUpdateStatus: (id: string, status: string) => void;
};

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onUpdateStatus }) => (
    <ul>
        {tasks.map(task => (
            <li key={task.id}>
                {task.title} - {task.status}
                <button onClick={() => onUpdateStatus(task.id, 'done')}>Mark as Done</button>
            </li>
        ))}
    </ul>
);
