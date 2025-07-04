import { useState } from 'react';

export function useDebugger() {
    const [breakpoints, setBreakpoints] = useState<number[]>([]);
    const [debugResult, setDebugResult] = useState<string>('');
    return { breakpoints, setBreakpoints, debugResult, setDebugResult };
}
