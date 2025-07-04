import React from 'react';

type MentorshipToolsProps = {
    mentors: string[];
    onRequest: (mentor: string) => void;
};

export const MentorshipTools: React.FC<MentorshipToolsProps> = ({ mentors, onRequest }) => (
    <ul>
        {mentors.map(m => (
            <li key={m}>
                {m} <button onClick={() => onRequest(m)}>Request Mentorship</button>
            </li>
        ))}
    </ul>
);
