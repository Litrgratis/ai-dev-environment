import React from 'react';

type ContentBasedSearchProps = {
    onSearch: (content: string) => void;
};

export const ContentBasedSearch: React.FC<ContentBasedSearchProps> = ({ onSearch }) => {
    const [content, setContent] = React.useState('');
    return (
        <div>
            <input
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Search by content..."
            />
            <button onClick={() => onSearch(content)}>Search</button>
        </div>
    );
};
