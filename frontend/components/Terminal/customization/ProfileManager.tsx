import React from 'react';

type ProfileManagerProps = {
    profiles: string[];
    selected: string;
    onSelect: (profile: string) => void;
    onAdd: (profile: string) => void;
};

export const ProfileManager: React.FC<ProfileManagerProps> = ({ profiles, selected, onSelect, onAdd }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <select value={selected} onChange={e => onSelect(e.target.value)}>
                {profiles.map(profile => (
                    <option key={profile} value={profile}>{profile}</option>
                ))}
            </select>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="New profile"
            />
            <button onClick={() => { onAdd(input); setInput(''); }}>Add Profile</button>
        </div>
    );
};
