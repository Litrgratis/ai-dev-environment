import { useState } from 'react';

export function useDebugger() {
    const [breakpoints, setBreakpoints] = useState<number[]>([]);
    const [debugResult, setDebugResult] = useState<string>('');
    const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
    // Add more AI debugging features as needed
    return {
        breakpoints,
        setBreakpoints,
        debugResult,
        setDebugResult,
        aiSuggestions,
        setAISuggestions,
    };
}
