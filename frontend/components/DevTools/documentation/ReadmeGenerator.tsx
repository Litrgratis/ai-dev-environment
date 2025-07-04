import React from 'react';

type ReadmeGeneratorProps = {
    onGenerate: () => void;
    readme: string;
};

export const ReadmeGenerator: React.FC<ReadmeGeneratorProps> = ({ onGenerate, readme }) => (
    <div>
        <button onClick={onGenerate}>Generate README</button>
        <pre>{readme}</pre>
    </div>
);
