import React from 'react';

type TutorialCreatorProps = {
    onCreate: () => void;
    tutorials: string[];
};

export const TutorialCreator: React.FC<TutorialCreatorProps> = ({ onCreate, tutorials }) => (
    <div>
        <button onClick={onCreate}>Create Tutorial</button>
        <ul>
            {tutorials.map((t, idx) => <li key={idx}>{t}</li>)}
        </ul>
    </div>
);
