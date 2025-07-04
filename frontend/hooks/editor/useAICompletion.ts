import { useState } from 'react';

export function useAICompletion() {
    const [completions, setCompletions] = useState<string[]>([]);
    return { completions, setCompletions };
}
