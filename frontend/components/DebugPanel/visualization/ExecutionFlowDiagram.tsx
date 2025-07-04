import React from 'react';

type ExecutionFlowDiagramProps = {
    steps: string[];
};

export const ExecutionFlowDiagram: React.FC<ExecutionFlowDiagramProps> = ({ steps }) => (
    <div>
        {steps.map((step, idx) => (
            <span key={idx}>
                {step}
                {idx < steps.length - 1 && ' → '}
            </span>
        ))}
    </div>
);
