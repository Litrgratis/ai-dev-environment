import React from 'react';

type Thread = { id: string; status: string };

type ThreadVisualizationProps = {
    threads: Thread[];
};

export const ThreadVisualization: React.FC<ThreadVisualizationProps> = ({ threads }) => (
    <ul>
        {threads.map(t => (
            <li key={t.id}>{t.id}: {t.status}</li>
        ))}
    </ul>
);
