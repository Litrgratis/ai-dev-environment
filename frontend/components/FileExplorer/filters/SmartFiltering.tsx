import React from 'react';

type SmartFilteringProps = {
    filters: string[];
    onFilter: (filter: string) => void;
};

export const SmartFiltering: React.FC<SmartFilteringProps> = ({ filters, onFilter }) => (
    <ul>
        {filters.map(f => (
            <li key={f}>
                {f} <button onClick={() => onFilter(f)}>Filter</button>
            </li>
        ))}
    </ul>
);
