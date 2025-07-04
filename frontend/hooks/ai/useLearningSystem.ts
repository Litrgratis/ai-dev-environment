import { useState } from 'react';

export function useLearningSystem() {
    const [feedback, setFeedback] = useState<string[]>([]);
    return { feedback, setFeedback };
}
