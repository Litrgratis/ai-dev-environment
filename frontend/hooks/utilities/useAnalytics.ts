import { useState } from 'react';

export function useAnalytics() {
    const [analytics, setAnalytics] = useState<Record<string, number>>({});
    return { analytics, setAnalytics };
}
