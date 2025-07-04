import React from 'react';

type AICollaborationProps = {
    onCollaborate: () => void;
    isCollaborating: boolean;
};

export const AICollaboration: React.FC<AICollaborationProps> = ({ onCollaborate, isCollaborating }) => (
    <button onClick={onCollaborate}>
        {isCollaborating ? 'Stop Collaboration' : 'Start AI Collaboration'}
    </button>
);
