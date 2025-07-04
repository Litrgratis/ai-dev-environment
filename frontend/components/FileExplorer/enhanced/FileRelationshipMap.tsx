import React from 'react';

type FileRelationshipMapProps = {
    relationships: { from: string; to: string }[];
};

export const FileRelationshipMap: React.FC<FileRelationshipMapProps> = ({ relationships }) => (
    <ul>
        {relationships.map((rel, idx) => (
            <li key={idx}>{rel.from} → {rel.to}</li>
        ))}
    </ul>
);
