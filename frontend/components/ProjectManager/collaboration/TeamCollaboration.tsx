import React from 'react';

type TeamCollaborationProps = {
    members: string[];
    onInvite: (member: string) => void;
};

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({ members, onInvite }) => {
    const [input, setInput] = React.useState('');
    return (
        <div>
            <ul>
                {members.map((m, idx) => <li key={idx}>{m}</li>)}
            </ul>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Invite member"
            />
            <button onClick={() => { onInvite(input); setInput(''); }}>Invite</button>
        </div>
    );
};
