import React from 'react';

type StyleGuideCheckerProps = {
    issues: string[];
    onCheck: () => void;
};

export const StyleGuideChecker: React.FC<StyleGuideCheckerProps> = ({ issues, onCheck }) => (
    <div>
        <button onClick={onCheck}>Check Style Guide</button>
        <ul>
            {issues.map((i, idx) => <li key={idx}>{i}</li>)}
        </ul>
    </div>
);
