import React from 'react';

type TestCaseBuilderProps = {
    onAdd: (test: string) => void;
};

export const TestCaseBuilder: React.FC<TestCaseBuilderProps> = ({ onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New test case"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Test Case</button>
        </div>
    );
};
