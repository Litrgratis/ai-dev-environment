import React from 'react';

type CDPipelineProps = {
    onRun: () => void;
    status: string;
};

export const CDPipeline: React.FC<CDPipelineProps> = ({ onRun, status }) => (
    <div>
        <button onClick={onRun}>Run CD Pipeline</button>
        <span>Status: {status}</span>
    </div>
);
