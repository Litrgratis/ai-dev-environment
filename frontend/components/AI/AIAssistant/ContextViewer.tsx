import React from 'react';

type ContextViewerProps = {
    context: string;
};

export const ContextViewer: React.FC<ContextViewerProps> = ({ context }) => (
    <pre>{context}</pre>
);
