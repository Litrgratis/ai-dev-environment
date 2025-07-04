import React from 'react';

type SmartCompletionProps = {
    completions: string[];
    onComplete: (completion: string) => void;
};

export const SmartCompletion: React.FC<SmartCompletionProps> = ({ completions, onComplete }) => (
    <div>
        {completions.map(c => (
            <button key={c} onClick={() => onComplete(c)}>{c}</button>
        ))}
    </div>
);
