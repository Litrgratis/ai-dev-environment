import React from 'react';

type AutoCommandCompletionProps = {
    completions: string[];
    onComplete: (completion: string) => void;
};

export const AutoCommandCompletion: React.FC<AutoCommandCompletionProps> = ({ completions, onComplete }) => (
    <div>
        {completions.map(c => (
            <button key={c} onClick={() => onComplete(c)}>{c}</button>
        ))}
    </div>
);
