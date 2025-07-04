import React from 'react';

type StructureOptimizerProps = {
    onOptimize: () => void;
};

export const StructureOptimizer: React.FC<StructureOptimizerProps> = ({ onOptimize }) => (
    <button onClick={onOptimize}>Optimize Structure</button>
);
