import { useState } from 'react';

export function usePerformanceOptimization() {
    const [hints, setHints] = useState<string[]>([]);
    return { hints, setHints };
}
