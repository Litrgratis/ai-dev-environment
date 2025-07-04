import React from 'react';

type SemanticHighlightingProps = {
    code: string;
    highlights: { start: number; end: number; className: string }[];
};

export const SemanticHighlighting: React.FC<SemanticHighlightingProps> = ({ code, highlights }) => (
    <pre>
        {/* Render code with semantic highlights */}
        {/* ...highlighting logic... */}
        {code}
    </pre>
);
