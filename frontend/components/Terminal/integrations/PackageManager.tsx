import React from 'react';

type PackageManagerProps = {
    onCommand: (command: string) => void;
};

export const PackageManager: React.FC<PackageManagerProps> = ({ onCommand }) => {
    const [cmd, setCmd] = React.useState('');
    return (
        <div>
            <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                placeholder="package manager command"
            />
            <button onClick={() => { onCommand(cmd); setCmd(''); }}>Run</button>
        </div>
    );
};
