import React from 'react';

type SemanticSearchProps = {
    onSemanticSearch: (query: string) => void;
};

export const SemanticSearch: React.FC<SemanticSearchProps> = ({ onSemanticSearch }) => {
    const [query, setQuery] = React.useState('');
    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Semantic search..."
            />
            <button onClick={() => onSemanticSearch(query)}>Search</button>
        </div>
    );
};
