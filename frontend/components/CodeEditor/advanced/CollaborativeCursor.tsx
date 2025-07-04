import React from 'react';

type Cursor = { id: string; x: number; y: number; color: string };

type CollaborativeCursorProps = {
    cursors: Cursor[];
};

export const CollaborativeCursor: React.FC<CollaborativeCursorProps> = ({ cursors }) => (
    <>
        {cursors.map(cursor => (
            <div
                key={cursor.id}
                style={{
                    position: 'absolute',
                    left: cursor.x,
                    top: cursor.y,
                    background: cursor.color,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                }}
            />
        ))}
    </>
);
