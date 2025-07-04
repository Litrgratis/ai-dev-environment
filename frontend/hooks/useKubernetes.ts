import { useState } from 'react';

export function useKubernetes() {
    const [pods, setPods] = useState<any[]>([]);
    return { pods, setPods };
}
