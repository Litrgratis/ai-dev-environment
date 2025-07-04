import React from 'react';

type CodeAnalysisProps = {
    analysis: string;
};

export const CodeAnalysis: React.FC<CodeAnalysisProps> = ({ analysis }) => (
    <pre>{analysis}</pre>
);
