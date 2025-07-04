import React from 'react';

type TeamLearningProps = {
    topics: string[];
    onAddTopic: (topic: string) => void;
};

export const TeamLearning: React.FC<TeamLearningProps> = ({ topics, onAddTopic }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {topics.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New topic"
            />
            <button onClick={() => { onAddTopic(input); setInput(''); }}>Add Topic</button>
        </div>
    );
};
