import { useState } from 'react';

export function useTestRunner() {
    const [tests, setTests] = useState<string[]>([]);
    const [results, setResults] = useState<string[]>([]);
    return { tests, setTests, results, setResults };
}
