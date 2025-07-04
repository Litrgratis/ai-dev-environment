import React from 'react';

type AutoDebuggerProps = {
    onDebug: () => void;
    status: string;
};

export const AutoDebugger: React.FC<AutoDebuggerProps> = ({ onDebug, status }) => (
    <div>
        <button onClick={onDebug}>Auto Debug</button>
        <div>Status: {status}</div>
    </div>
);
