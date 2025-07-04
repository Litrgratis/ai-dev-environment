import React from 'react';

type KnowledgeBaseProps = {
    articles: { title: string; content: string }[];
};

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ articles }) => (
    <div>
        {articles.map((a, idx) => (
            <details key={idx}>
                <summary>{a.title}</summary>
                <div>{a.content}</div>
            </details>
        ))}
    </div>
);
