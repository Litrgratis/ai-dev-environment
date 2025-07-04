import React from 'react';

type WorkspaceSyncProps = {
    onSync: () => void;
    status: string;
};

export const WorkspaceSync: React.FC<WorkspaceSyncProps> = ({ onSync, status }) => (
    <div>
        <button onClick={onSync}>Sync Workspace</button>
        <span>Status: {status}</span>
    </div>
);
