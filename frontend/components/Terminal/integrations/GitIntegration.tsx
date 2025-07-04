import React from 'react';

type GitIntegrationProps = {
    onCommand: (command: string) => void;
};

export const GitIntegration: React.FC<GitIntegrationProps> = ({ onCommand }) => {
    const [cmd, setCmd] = React.useState('');
    return (
        <div>
            <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                placeholder="git command"
            />
            <button onClick={() => { onCommand(cmd); setCmd(''); }}>Run</button>
        </div>
    );
};
