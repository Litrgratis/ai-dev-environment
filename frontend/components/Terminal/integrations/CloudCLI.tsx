import React from 'react';

type CloudCLIProps = {
    onCommand: (command: string) => void;
};

export const CloudCLI: React.FC<CloudCLIProps> = ({ onCommand }) => {
    const [cmd, setCmd] = React.useState('');
    return (
        <div>
            <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                placeholder="cloud CLI command"
            />
            <button onClick={() => { onCommand(cmd); setCmd(''); }}>Run</button>
        </div>
    );
};
