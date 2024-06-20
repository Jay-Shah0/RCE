// src/FileExplorer.tsx
import React, { useState } from "react";

interface FileNode {
	name: string;
	children?: FileNode[];
}

interface FileExplorerProps {
	tree: FileNode[];
    isOpen: boolean
}

const FileExplorer: React.FC<FileExplorerProps> = ({ tree, isOpen }) => {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const toggleNode = (name: string) => {
		const newExpanded = new Set(expanded);
		if (newExpanded.has(name)) {
			newExpanded.delete(name);
		} else {
			newExpanded.add(name);
		}
		setExpanded(newExpanded);
	};

	const renderTree = (nodes: FileNode[]) => {
		return nodes.map((node) => (
			<div key={node.name} className="ml-4">
				<div
					className="cursor-pointer hover:bg-gray-600 p-1"
					onClick={() => node.children && toggleNode(node.name)}
				>
					{node.children && (
						<span className="mr-2">
							{expanded.has(node.name) ? "📂" : "📁"}
						</span>
					)}
					{node.name}
				</div>
				{expanded.has(node.name) && node.children && (
					<div className="pl-4 border-l border-gray-500">
						{renderTree(node.children)}
					</div>
				)}
			</div>
		));
	};

	return (
		<div
			className={`h-full bg-explorer-dark transition-transform ${
				isOpen ? "transform translate-x-0" : "transform -translate-x-full"
			}`}
			style={{ width: "250px" }}
		>
			{renderTree(tree)}
		</div>
	);
};

export default FileExplorer;
