import React from 'react';

type CommandOptimizationProps = {
    command: string;
    optimized: string;
    onApply: () => void;
};

export const CommandOptimization: React.FC<CommandOptimizationProps> = ({ command, optimized, onApply }) => (
    <div>
        <div>Original: {command}</div>
        <div>Optimized: {optimized}</div>
        <button onClick={onApply}>Apply Optimized</button>
    </div>
);
