import React from 'react';

type Milestone = { name: string; completed: boolean };

type MilestoneTrackerProps = {
    milestones: Milestone[];
    onToggle: (name: string) => void;
};

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ milestones, onToggle }) => (
    <ul>
        {milestones.map(m => (
            <li key={m.name}>
                <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={() => onToggle(m.name)}
                />
                {m.name}
            </li>
        ))}
    </ul>
);
