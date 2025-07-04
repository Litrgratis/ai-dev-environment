import React from 'react';

type KnowledgeSharingProps = {
    topics: string[];
    onShare: (topic: string) => void;
};

export const KnowledgeSharing: React.FC<KnowledgeSharingProps> = ({ topics, onShare }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {topics.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Share topic"
            />
            <button onClick={() => { onShare(input); setInput(''); }}>Share</button>
        </div>
    );
};
