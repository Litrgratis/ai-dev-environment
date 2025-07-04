import { useState } from 'react';

export function useWorkspace() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    return { settings, setSettings };
}
