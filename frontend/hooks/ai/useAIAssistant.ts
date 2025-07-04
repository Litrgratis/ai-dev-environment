import { useState } from 'react';

export function useAIAssistant() {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    return { messages, setMessages };
}
