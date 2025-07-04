import { useState } from 'react';

export function useTerminal() {
    const [history, setHistory] = useState<string[]>([]);
    const [output, setOutput] = useState<string>('');
    const [activeSession, setActiveSession] = useState<string>('');
    // Add more advanced terminal features as needed
    return {
        history,
        setHistory,
        output,
        setOutput,
        activeSession,
        setActiveSession,
    };
}
