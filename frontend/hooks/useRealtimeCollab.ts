import { useState } from 'react';

export function useRealtimeCollab() {
    const [cursors, setCursors] = useState<any[]>([]);
    const [value, setValue] = useState<string>('');
    const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
    return { cursors, setCursors, value, setValue, voiceEnabled, setVoiceEnabled };
}
