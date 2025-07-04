import { useState } from 'react';

export function useCodeEditor() {
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('typescript');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [highlights, setHighlights] = useState<any[]>([]);
    // Add more editor features as needed (AI, Monaco, etc.)
    return {
        code,
        setCode,
        language,
        setLanguage,
        suggestions,
        setSuggestions,
        highlights,
        setHighlights,
    };
}
