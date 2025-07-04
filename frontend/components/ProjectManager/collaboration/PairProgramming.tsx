import React from 'react';

type PairProgrammingProps = {
    partner: string;
    onRequest: () => void;
};

export const PairProgramming: React.FC<PairProgrammingProps> = ({ partner, onRequest }) => (
    <div>
        <div>Pairing with: {partner}</div>
        <button onClick={onRequest}>Request Pair Programming</button>
    </div>
);
