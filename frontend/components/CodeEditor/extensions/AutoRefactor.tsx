import React from 'react';

type AutoRefactorProps = {
    onRefactor: () => void;
};

export const AutoRefactor: React.FC<AutoRefactorProps> = ({ onRefactor }) => (
    <button onClick={onRefactor}>Auto Refactor</button>
);
