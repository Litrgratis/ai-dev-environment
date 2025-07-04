import React from 'react';

type BugPatternDetectorProps = {
    patterns: string[];
};

export const BugPatternDetector: React.FC<BugPatternDetectorProps> = ({ patterns }) => (
    <ul>
        {patterns.map((p, idx) => <li key={idx}>{p}</li>)}
    </ul>
);
