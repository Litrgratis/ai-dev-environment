import { useState } from 'react';

export function useAIOrchestrator() {
    const [model, setModel] = useState<string>('gpt-4');
    const [context, setContext] = useState<string>('');
    return { model, setModel, context, setContext };
}
