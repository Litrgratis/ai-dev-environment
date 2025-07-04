import React from 'react';

type KubernetesDebuggerProps = {
    onAttach: (pod: string) => void;
    pods: string[];
};

export const KubernetesDebugger: React.FC<KubernetesDebuggerProps> = ({ onAttach, pods }) => {
    const [pod, setPod] = React.useState('');
    return (
        <div>
            <select value={pod} onChange={e => setPod(e.target.value)}>
                <option value="">Select pod</option>
                {pods.map(p => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>
            <button onClick={() => onAttach(pod)} disabled={!pod}>Attach</button>
        </div>
    );
};
