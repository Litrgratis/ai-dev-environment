import { useState } from 'react';

export function useResourceManager() {
    const [resources, setResources] = useState<string[]>([]);
    return { resources, setResources };
}
