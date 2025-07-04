import React from 'react';

type DockerIntegrationProps = {
    onCommand: (command: string) => void;
};

export const DockerIntegration: React.FC<DockerIntegrationProps> = ({ onCommand }) => {
    const [cmd, setCmd] = React.useState('');
    return (
        <div>
            <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                placeholder="docker command"
            />
            <button onClick={() => { onCommand(cmd); setCmd(''); }}>Run</button>
        </div>
    );
};
