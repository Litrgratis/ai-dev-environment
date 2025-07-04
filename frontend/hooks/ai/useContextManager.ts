import { useState } from 'react';

export function useContextManager() {
    const [context, setContext] = useState<string>('');
    return { context, setContext };
}
