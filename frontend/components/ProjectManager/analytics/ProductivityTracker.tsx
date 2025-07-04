import React from 'react';

type ProductivityTrackerProps = {
    productivity: number;
};

export const ProductivityTracker: React.FC<ProductivityTrackerProps> = ({ productivity }) => (
    <div>Productivity: {productivity}</div>
);
