import { useState } from 'react';

export function useProjectManager() {
    const [projects, setProjects] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>('');
    return { projects, setProjects, selected, setSelected };
}
