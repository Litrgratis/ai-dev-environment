import { useState } from 'react';

export function useAutomation() {
    const [status, setStatus] = useState<string>('');
    return { status, setStatus };
}
