import React from 'react';

type AITerminalAssistantProps = {
    onCommand: (command: string) => void;
};

export const AITerminalAssistant: React.FC<AITerminalAssistantProps> = ({ onCommand }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask AI for terminal help..."
            />
            <button onClick={() => { onCommand(input); setInput(''); }}>Ask</button>
        </div>
    );
};
