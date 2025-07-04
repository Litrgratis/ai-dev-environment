import React from 'react';

type APIDocBuilderProps = {
    onBuild: () => void;
    docs: string[];
};

export const APIDocBuilder: React.FC<APIDocBuilderProps> = ({ onBuild, docs }) => (
    <div>
        <button onClick={onBuild}>Build API Docs</button>
        <ul>
            {docs.map((d, idx) => <li key={idx}>{d}</li>)}
        </ul>
    </div>
);
