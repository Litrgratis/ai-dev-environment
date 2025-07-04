import React from 'react';

type Node = { id: string; label: string };
type Edge = { from: string; to: string };

type GraphViewProps = {
    nodes: Node[];
    edges: Edge[];
};

export const GraphView: React.FC<GraphViewProps> = ({ nodes, edges }) => (
    <div>
        <div>Nodes: {nodes.map(n => n.label).join(', ')}</div>
        <div>Edges: {edges.map(e => `${e.from}→${e.to}`).join(', ')}</div>
    </div>
);
