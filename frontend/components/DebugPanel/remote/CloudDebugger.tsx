import React from 'react';

type CloudDebuggerProps = {
    onConnect: (instance: string) => void;
    instances: string[];
};

export const CloudDebugger: React.FC<CloudDebuggerProps> = ({ onConnect, instances }) => {
    const [instance, setInstance] = React.useState('');
    return (
        <div>
            <select value={instance} onChange={e => setInstance(e.target.value)}>
                <option value="">Select instance</option>
                {instances.map(i => (
                    <option key={i} value={i}>{i}</option>
                ))}
            </select>
            <button onClick={() => onConnect(instance)} disabled={!instance}>Connect</button>
        </div>
    );
};
