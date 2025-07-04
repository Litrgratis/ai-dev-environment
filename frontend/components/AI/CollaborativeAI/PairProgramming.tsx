import React from 'react';

type PairProgrammingProps = {
    partner: string;
    onRequestPair: () => void;
};

export const PairProgramming: React.FC<PairProgrammingProps> = ({ partner, onRequestPair }) => (
    <div>
        <div>Pairing with: {partner}</div>
        <button onClick={onRequestPair}>Request Pair</button>
    </div>
);
