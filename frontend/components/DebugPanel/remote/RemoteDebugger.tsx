import React from 'react';

type RemoteDebuggerProps = {
    onConnect: (address: string) => void;
    status: string;
};

export const RemoteDebugger: React.FC<RemoteDebuggerProps> = ({ onConnect, status }) => {
    const [address, setAddress] = React.useState('');
    return (
        <div>
            <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Remote address"
            />
            <button onClick={() => onConnect(address)}>Connect</button>
            <div>Status: {status}</div>
        </div>
    );
};
