import React from 'react';

type ModelCardProps = {
    name: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
};

export const ModelCard: React.FC<ModelCardProps> = ({ name, description, selected, onSelect }) => (
    <div style={{ border: selected ? '2px solid blue' : '1px solid #ccc', padding: 12, margin: 8 }}>
        <h3>{name}</h3>
        <p>{description}</p>
        <button onClick={onSelect}>{selected ? 'Selected' : 'Select'}</button>
    </div>
);
