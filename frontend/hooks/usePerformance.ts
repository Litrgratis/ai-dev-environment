import { useState } from 'react';

export function usePerformance() {
    const [cpu, setCpu] = useState<number>(0);
    const [memory, setMemory] = useState<number>(0);
    const [executionTime, setExecutionTime] = useState<number>(0);
    return { cpu, setCpu, memory, setMemory, executionTime, setExecutionTime };
}
