import React from 'react';

type TerminalSplitterProps = {
    onSplit: () => void;
};

export const TerminalSplitter: React.FC<TerminalSplitterProps> = ({ onSplit }) => (
    <button onClick={onSplit}>Split Terminal</button>
);
