import React from 'react';

type BatchFileOperationsProps = {
    onBatchAction: (action: string) => void;
};

export const BatchFileOperations: React.FC<BatchFileOperationsProps> = ({ onBatchAction }) => (
    <div>
        <button onClick={() => onBatchAction('delete')}>Delete Selected</button>
        <button onClick={() => onBatchAction('move')}>Move Selected</button>
        <button onClick={() => onBatchAction('copy')}>Copy Selected</button>
    </div>
);
