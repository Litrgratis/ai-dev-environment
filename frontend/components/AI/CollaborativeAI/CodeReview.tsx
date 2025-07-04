import React from 'react';

type CodeReviewProps = {
    comments: { line: number; comment: string }[];
    onAddComment: (line: number, comment: string) => void;
};

export const CodeReview: React.FC<CodeReviewProps> = ({ comments, onAddComment }) => {
    const [line, setLine] = React.useState(1);
    const [comment, setComment] = React.useState('');
    return (
        <div>
            <ul>
                {comments.map((c, idx) => (
                    <li key={idx}>Line {c.line}: {c.comment}</li>
                ))}
            </ul>
            <input
                type="number"
                value={line}
                onChange={e => setLine(Number(e.target.value))}
                min={1}
            />
            <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add comment"
            />
            <button onClick={() => { onAddComment(line, comment); setComment(''); }}>Add Comment</button>
        </div>
    );
};
