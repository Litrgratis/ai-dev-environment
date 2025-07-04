import React from 'react';

type LearningFeedbackProps = {
    onFeedback: (feedback: string) => void;
};

export const LearningFeedback: React.FC<LearningFeedbackProps> = ({ onFeedback }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Your feedback"
            />
            <button onClick={() => { onFeedback(input); setInput(''); }}>Send Feedback</button>
        </div>
    );
};
