import React from 'react';

type SmartFileSearchProps = {
    onSearch: (query: string) => void;
};

export const SmartFileSearch: React.FC<SmartFileSearchProps> = ({ onSearch }) => {
    const [query, setQuery] = React.useState('');
    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search files..."
            />
            <button onClick={() => onSearch(query)}>Search</button>
        </div>
    );
};
