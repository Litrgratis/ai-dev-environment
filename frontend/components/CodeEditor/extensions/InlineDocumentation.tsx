import React from 'react';

type InlineDocumentationProps = {
    doc: string;
};

export const InlineDocumentation: React.FC<InlineDocumentationProps> = ({ doc }) => (
    <div style={{ background: '#f9f9f9', padding: 8, border: '1px solid #eee' }}>
        {doc}
    </div>
);
