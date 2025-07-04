import { useState } from 'react';

export function useSmartFormat() {
    const [formatted, setFormatted] = useState<string>('');
    return { formatted, setFormatted };
}
