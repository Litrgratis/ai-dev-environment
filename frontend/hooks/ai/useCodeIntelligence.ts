import { useState } from 'react';

export function useCodeIntelligence() {
    const [analysis, setAnalysis] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    return { analysis, setAnalysis, suggestions, setSuggestions };
}
