import React from 'react';

type ProjectAutomationProps = {
    onAutomate: () => void;
};

export const ProjectAutomation: React.FC<ProjectAutomationProps> = ({ onAutomate }) => (
    <button onClick={onAutomate}>Automate Project</button>
);
