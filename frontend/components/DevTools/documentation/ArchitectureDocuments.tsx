import React from 'react';

type ArchitectureDocumentsProps = {
    docs: string[];
};

export const ArchitectureDocuments: React.FC<ArchitectureDocumentsProps> = ({ docs }) => (
    <ul>
        {docs.map((d, idx) => <li key={idx}>{d}</li>)}
    </ul>
);
