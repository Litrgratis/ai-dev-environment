import React from 'react';

type VariablePredictorProps = {
    variables: { name: string; predictedValue: string }[];
};

export const VariablePredictor: React.FC<VariablePredictorProps> = ({ variables }) => (
    <ul>
        {variables.map(v => (
            <li key={v.name}>{v.name}: {v.predictedValue}</li>
        ))}
    </ul>
);
