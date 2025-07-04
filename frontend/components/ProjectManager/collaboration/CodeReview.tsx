import React from 'react';

type CodeReviewProps = {
    reviews: { reviewer: string; comment: string }[];
    onAdd: (reviewer: string, comment: string) => void;
};

export const CodeReview: React.FC<CodeReviewProps> = ({ reviews, onAdd }) => {
    const [reviewer, setReviewer] = React.useState('');
    const [comment, setComment] = React.useState('');
    return (
        <div>
            <ul>
                {reviews.map((r, idx) => (
                    <li key={idx}>{r.reviewer}: {r.comment}</li>
                ))}
            </ul>
            <input
                value={reviewer}
                onChange={e => setReviewer(e.target.value)}
                placeholder="Reviewer"
            />
            <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Comment"
            />
            <button onClick={() => { onAdd(reviewer, comment); setReviewer(''); setComment(''); }}>Add Review</button>
        </div>
    );
};
