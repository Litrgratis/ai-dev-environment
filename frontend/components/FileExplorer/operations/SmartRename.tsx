import React from 'react';

type SmartRenameProps = {
    onRename: (oldName: string, newName: string) => void;
};

export const SmartRename: React.FC<SmartRenameProps> = ({ onRename }) => {
    const [oldName, setOldName] = React.useState('');
    const [newName, setNewName] = React.useState('');
    return (
        <div>
            <input
                value={oldName}
                onChange={e => setOldName(e.target.value)}
                placeholder="Old name"
            />
            <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="New name"
            />
            <button onClick={() => onRename(oldName, newName)}>Rename</button>
        </div>
    );
};
