import React from 'react';

type Model = { name: string; metrics: Record<string, number> };

type ModelComparisonProps = {
    models: Model[];
};

export const ModelComparison: React.FC<ModelComparisonProps> = ({ models }) => (
    <table>
        <thead>
            <tr>
                <th>Model</th>
                {models[0] && Object.keys(models[0].metrics).map(metric => (
                    <th key={metric}>{metric}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {models.map(model => (
                <tr key={model.name}>
                    <td>{model.name}</td>
                    {Object.values(model.metrics).map((value, idx) => (
                        <td key={idx}>{value}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);
