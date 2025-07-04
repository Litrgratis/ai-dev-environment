import React from 'react';

type SmartNavigationProps = {
    files: string[];
    onNavigate: (file: string) => void;
};

export const SmartNavigation: React.FC<SmartNavigationProps> = ({ files, onNavigate }) => (
    <ul>
        {files.map(file => (
            <li key={file}>
                <button onClick={() => onNavigate(file)}>{file}</button>
            </li>
        ))}
    </ul>
);
