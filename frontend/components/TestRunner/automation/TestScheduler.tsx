import React from 'react';

type TestSchedulerProps = {
    onSchedule: (time: string) => void;
};

export const TestScheduler: React.FC<TestSchedulerProps> = ({ onSchedule }) => {
    const [time, setTime] = React.useState('');
    return (
        <div>
            <input
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="Schedule time"
            />
            <button onClick={() => onSchedule(time)}>Schedule</button>
        </div>
    );
};
