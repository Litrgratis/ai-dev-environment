import React from 'react';

type AIBasedFiltersProps = {
    filters: string[];
    onApply: (filter: string) => void;
};

export const AIBasedFilters: React.FC<AIBasedFiltersProps> = ({ filters, onApply }) => (
    <ul>
        {filters.map(f => (
            <li key={f}>
                {f} <button onClick={() => onApply(f)}>Apply</button>
            </li>
        ))}
    </ul>
);
