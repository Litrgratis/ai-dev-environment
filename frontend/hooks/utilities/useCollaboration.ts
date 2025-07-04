import { useState } from 'react';

export function useCollaboration() {
    const [members, setMembers] = useState<string[]>([]);
    return { members, setMembers };
}
