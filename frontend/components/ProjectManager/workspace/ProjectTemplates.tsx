import React from 'react';

type ProjectTemplatesProps = {
    templates: string[];
    onCreate: (template: string) => void;
};

export const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({ templates, onCreate }) => (
    <ul>
        {templates.map(t => (
            <li key={t}>
                {t} <button onClick={() => onCreate(t)}>Create Project</button>
            </li>
        ))}
    </ul>
);
