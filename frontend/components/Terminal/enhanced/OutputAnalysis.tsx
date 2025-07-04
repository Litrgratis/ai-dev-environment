import React from 'react';

type OutputAnalysisProps = {
    output: string;
    analysis: string;
};

export const OutputAnalysis: React.FC<OutputAnalysisProps> = ({ output, analysis }) => (
    <div>
        <pre>{output}</pre>
        <div>Analysis: {analysis}</div>
    </div>
);
