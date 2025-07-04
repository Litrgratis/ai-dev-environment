import React from 'react';

type TestScenarioBuilderProps = {
    onAdd: (scenario: string) => void;
};

export const TestScenarioBuilder: React.FC<TestScenarioBuilderProps> = ({ onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New scenario"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Scenario</button>
        </div>
    );
};
