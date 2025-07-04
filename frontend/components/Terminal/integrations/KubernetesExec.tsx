import React from 'react';

type KubernetesExecProps = {
    onExec: (command: string) => void;
};

export const KubernetesExec: React.FC<KubernetesExecProps> = ({ onExec }) => {
    const [cmd, setCmd] = React.useState('');
    return (
        <div>
            <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                placeholder="kubectl command"
            />
            <button onClick={() => { onExec(cmd); setCmd(''); }}>Execute</button>
        </div>
    );
};
