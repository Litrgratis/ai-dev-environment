import React from 'react';

type TreeNode = { name: string; children?: TreeNode[] };

type TreeVisualizationProps = {
    tree: TreeNode;
};

function renderTree(node: TreeNode) {
    return (
        <li>
            {node.name}
            {node.children && (
                <ul>
                    {node.children.map((child, idx) => (
                        <React.Fragment key={idx}>{renderTree(child)}</React.Fragment>
                    ))}
                </ul>
            )}
        </li>
    );
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({ tree }) => (
    <ul>
        {renderTree(tree)}
    </ul>
);
