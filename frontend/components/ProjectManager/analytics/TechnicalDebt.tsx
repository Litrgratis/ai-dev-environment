import React from 'react';

type TechnicalDebtProps = {
    debt: number;
};

export const TechnicalDebt: React.FC<TechnicalDebtProps> = ({ debt }) => (
    <div>Technical Debt: {debt}</div>
);
