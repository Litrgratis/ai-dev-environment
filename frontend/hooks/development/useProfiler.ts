import { useState } from 'react';

export function useProfiler() {
    const [metrics, setMetrics] = useState<Record<string, number>>({});
    return { metrics, setMetrics };
}
