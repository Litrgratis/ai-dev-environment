import React from 'react';

type FeedbackLoopProps = {
    onFeedback: (feedback: string) => void;
};

export const FeedbackLoop: React.FC<FeedbackLoopProps> = ({ onFeedback }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Feedback"
            />
            <button onClick={() => { onFeedback(input); setInput(''); }}>Send Feedback</button>
        </div>
    );
};
