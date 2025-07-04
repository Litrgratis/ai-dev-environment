import React from 'react';

type AIDebuggerProps = {
    onDebug: (code: string) => void;
    result: string;
};

export const AIDebugger: React.FC<AIDebuggerProps> = ({ onDebug, result }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste code to debug"
                rows={6}
            />
            <button onClick={() => onDebug(input)}>Debug</button>
            <pre>{result}</pre>
        </div>
    );
};
