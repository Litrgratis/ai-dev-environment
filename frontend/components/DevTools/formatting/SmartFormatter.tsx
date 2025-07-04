import React from 'react';

type SmartFormatterProps = {
    onFormat: () => void;
};

export const SmartFormatter: React.FC<SmartFormatterProps> = ({ onFormat }) => (
    <button onClick={onFormat}>Smart Format</button>
);
