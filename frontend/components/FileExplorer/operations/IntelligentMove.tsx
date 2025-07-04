import React from 'react';

type IntelligentMoveProps = {
    onMove: (file: string, destination: string) => void;
};

export const IntelligentMove: React.FC<IntelligentMoveProps> = ({ onMove }) => {
    const [file, setFile] = React.useState('');
    const [destination, setDestination] = React.useState('');
    return (
        <div>
            <input
                value={file}
                onChange={e => setFile(e.target.value)}
                placeholder="File to move"
            />
            <input
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Destination"
            />
            <button onClick={() => onMove(file, destination)}>Move</button>
        </div>
    );
};
