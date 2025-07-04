import React from 'react';

type TerminalThemesProps = {
    themes: string[];
    selected: string;
    onSelect: (theme: string) => void;
};

export const TerminalThemes: React.FC<TerminalThemesProps> = ({ themes, selected, onSelect }) => (
    <select value={selected} onChange={e => onSelect(e.target.value)}>
        {themes.map(theme => (
            <option key={theme} value={theme}>{theme}</option>
        ))}
    </select>
);
