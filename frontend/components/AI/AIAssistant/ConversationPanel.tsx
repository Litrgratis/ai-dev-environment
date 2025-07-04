import React from 'react';

type ConversationPanelProps = {
    messages: { sender: string; text: string }[];
    onSend: (text: string) => void;
};

export const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, onSend }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {messages.map((msg, idx) => (
                    <div key={idx}><b>{msg.sender}:</b> {msg.text}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        onSend(input);
                        setInput('');
                    }
                }}
            />
            <button onClick={() => { onSend(input); setInput(''); }}>Send</button>
        </div>
    );
};
