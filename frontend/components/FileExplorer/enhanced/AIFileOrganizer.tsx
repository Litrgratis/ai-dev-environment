import React from 'react';

type AIFileOrganizerProps = {
    onOrganize: () => void;
};

export const AIFileOrganizer: React.FC<AIFileOrganizerProps> = ({ onOrganize }) => (
    <button onClick={onOrganize}>Organize Files with AI</button>
);
