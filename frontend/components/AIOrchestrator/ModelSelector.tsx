import React from 'react';

type ModelSelectorProps = {
    models: string[];
    selectedModel: string;
    onSelect: (model: string) => void;
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onSelect }) => (
    <div>
        <label>AI Model:</label>
        <select value={selectedModel} onChange={e => onSelect(e.target.value)}>
            {models.map(model => (
                <option key={model} value={model}>{model}</option>
            ))}
        </select>
    </div>
);
