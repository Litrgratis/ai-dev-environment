import { useState } from 'react';

export function useProjectManager() {
    const [projects, setProjects] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [tasks, setTasks] = useState<string[]>([]);
    // Add more intelligent project management features as needed
    return {
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        tasks,
        setTasks,
    };
}
