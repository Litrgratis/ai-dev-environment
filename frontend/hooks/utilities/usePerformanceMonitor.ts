import { useState } from 'react';

export function usePerformanceMonitor() {
    const [metrics, setMetrics] = useState<Record<string, number>>({});
    return { metrics, setMetrics };
}
