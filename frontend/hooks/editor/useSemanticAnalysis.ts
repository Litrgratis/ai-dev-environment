import { useState } from 'react';

export function useSemanticAnalysis() {
    const [analysis, setAnalysis] = useState<string>('');
    return { analysis, setAnalysis };
}
