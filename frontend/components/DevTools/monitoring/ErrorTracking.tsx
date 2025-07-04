import React from 'react';

type ErrorTrackingProps = {
    errors: string[];
    onClear: () => void;
};

export const ErrorTracking: React.FC<ErrorTrackingProps> = ({ errors, onClear }) => (
    <div>
        <button onClick={onClear}>Clear Errors</button>
        <ul>
            {errors.map((e, idx) => <li key={idx}>{e}</li>)}
        </ul>
    </div>
);
