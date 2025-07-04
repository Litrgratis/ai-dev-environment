import React from 'react';

type CustomCommandsProps = {
    commands: string[];
    onRun: (cmd: string) => void;
    onAdd: (cmd: string) => void;
};

export const CustomCommands: React.FC<CustomCommandsProps> = ({ commands, onRun, onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {commands.map(cmd => (
                    <li key={cmd}>
                        {cmd} <button onClick={() => onRun(cmd)}>Run</button>
                    </li>
                ))}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New command"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Command</button>
        </div>
    );
};
