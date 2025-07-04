import React from 'react';

type MockDataGeneratorProps = {
    onGenerate: () => void;
    data: string[];
};

export const MockDataGenerator: React.FC<MockDataGeneratorProps> = ({ onGenerate, data }) => (
    <div>
        <button onClick={onGenerate}>Generate Mock Data</button>
        <ul>
            {data.map((d, idx) => <li key={idx}>{d}</li>)}
        </ul>
    </div>
);
