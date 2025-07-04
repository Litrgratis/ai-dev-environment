import { useState } from 'react';

export function useCollaborativeEdit() {
    const [cursors, setCursors] = useState<any[]>([]);
    const [content, setContent] = useState<string>('');
    return { cursors, setCursors, content, setContent };
}
