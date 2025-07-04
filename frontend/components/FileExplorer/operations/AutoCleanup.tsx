import React from 'react';

type AutoCleanupProps = {
    onCleanup: () => void;
};

export const AutoCleanup: React.FC<AutoCleanupProps> = ({ onCleanup }) => (
    <button onClick={onCleanup}>Auto Cleanup</button>
);
