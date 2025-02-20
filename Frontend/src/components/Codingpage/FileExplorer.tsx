import { useCoding } from "@/hooks/useCoding";
import { FileNode } from "@/utils/socketEventInterface";
import { faFile, faFolder, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";

interface FileExplorerProps {
	initialTree: FileNode[] | null;
	isOpen: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ initialTree, isOpen }) => {

	const { socket, selectedFileName, setSelectedFileName, selectedFileContent } = useCoding();

	const [tree, setTree] = useState<FileNode[] | null>(initialTree);
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [creatingNode, setCreatingNode] = useState<{
		parentPath: string;
		isDir: boolean;
	} | null>(null);


	const newNodeName = useRef<HTMLInputElement>(null);
	const selectedFilePath = useRef<string>("")

	const toggleNode = (name: string) => {
		const newExpanded = new Set(expanded);
		if (newExpanded.has(name)) {
			newExpanded.delete(name);
		} else {
			newExpanded.add(name);
		}
		setExpanded(newExpanded);
	};

	const sendFileEvent = (action: string, filePath: string, isDir: boolean, chunk: string | null) => {
		if (!socket) return;
		socket.send(
			JSON.stringify({
				event: "filetree",
				data: {
					action,
					filePath,
					isDir,
					chunk,
				},
			})
		);
	};

	const updateTree = (
		nodes: FileNode[],
		path: string[],
		name: string,
		isDir: boolean
	) => {
		if (path.length === 0) {
			nodes.push({ name, children: isDir ? [] : undefined });
			return;
		}

		for (const node of nodes) {
			if (node.name === path[0]) {
				if (node.children) {
					updateTree(node.children, path.slice(1), name, isDir);
				}
				break;
			}
		}
	};

	const createNode = (path: string, name: string, isDir: boolean) => {
		const pathArray = path.split("/").filter(Boolean);
		const newTree = [...(tree || [])];
		updateTree(newTree, pathArray, name, isDir);
		setTree(newTree);
		sendFileEvent("create", `${path}/${name}`, isDir, null);
	};

	const deleteNodeFromTree = (nodes: FileNode[], path: string[]) => {
		if (path.length === 1) {
			const index = nodes.findIndex((node) => node.name === path[0]);
			if (index !== -1) nodes.splice(index, 1);
			return;
		}

		for (const node of nodes) {
			if (node.name === path[0] && node.children) {
				deleteNodeFromTree(node.children, path.slice(1));
				break;
			}
		}
	};

	const deleteNode = (path: string, name: string, isDir: boolean) => {
		const pathArray = path.split("/").filter(Boolean);
		const newTree = [...(tree || [])];
		deleteNodeFromTree(newTree, [...pathArray, name]);
		setTree(newTree);
		sendFileEvent("delete", `${path}/${name}`, isDir, null);
	};

	const handleCreateNode = (parentPath: string, isDir: boolean) => {
		setCreatingNode({ parentPath, isDir });
	};

	const handleNodeNameSubmit = () => {
		if (creatingNode && newNodeName.current?.value.trim()) {
			createNode(
				creatingNode.parentPath,
				newNodeName.current.value.trim(),
				creatingNode.isDir
			);
			setCreatingNode(null);
			newNodeName.current.value = "";
		}
	};

	const handleNodeNameCancel = () => {
		setCreatingNode(null);
		if (newNodeName.current) newNodeName.current.value = "";
	};

	const handleFileSelection = (path: string, name: string) => {
		sendFileChunks();
		setSelectedFileName(name);
		selectedFilePath.current = `${path}/${name}`;
		sendFileEvent("read", selectedFilePath.current, false, null);
	};

	const sendFileChunks = () => {
		if (!socket) return;
		if (selectedFileContent === null) return

		const chunkSize = 1024; // Define the size of each chunk
		let offset = 0;

		const sendNextChunk = () => {
			if (offset < selectedFileContent.length) {
				const chunk = selectedFileContent.substring(offset, offset + chunkSize);
				sendFileEvent("write", selectedFilePath.current,true,chunk);
				offset += chunkSize;
				sendNextChunk();
			} else {
				sendFileEvent("writeEnd", selectedFilePath.current, true, null);
			}
		};

		sendNextChunk();
	};

	const renderTree = (nodes: FileNode[] | null, parentPath: string = "") => {
		if (!nodes) {
			return <>Files not loaded</>;
		}

		return nodes.map((node) => {
			const currentPath = `${parentPath}/${node.name}`;
			const isSelected = selectedFileName === node.name;
			return (
				<div
					key={node.name}
					className={`ml-4 ${isSelected ? "bg-blue-500" : ""}`}
				>
					<div
						className="flex items-center cursor-pointer hover:bg-gray-600 p-1"
						onClick={() => {
							if (!node.children) {
								handleFileSelection(parentPath, node.name);
							} else {
								toggleNode(node.name);
							}
						}}
					>
						{node.children && (
							<span className="mr-2">
								{expanded.has(node.name) ? "📂" : "📁"}
							</span>
						)}
						{node.name}
						{node.children && (
							<div className="ml-2 flex space-x-2">
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleCreateNode(currentPath, true);
									}}
									className="px-2 py-1 m-1 text-xs flex items-center"
								>
									<FontAwesomeIcon
										icon={faFolder}
										style={{ marginRight: "5px" }}
									/>
									<FontAwesomeIcon icon={faPlus} style={{ fontSize: "12px" }} />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleCreateNode(currentPath, false);
									}}
									className="px-2 py-1 m-1 text-xs flex items-center"
								>
									<FontAwesomeIcon
										icon={faFile}
										style={{ marginRight: "5px" }}
									/>
									<FontAwesomeIcon icon={faPlus} style={{ fontSize: "12px" }} />
								</button>
							</div>
						)}
						<button
							className="ml-2"
							onClick={(e) => {
								e.stopPropagation();
								deleteNode(parentPath, node.name, !!node.children);
							}}
						>
							<FontAwesomeIcon icon={faTrash} className="mr-1" />
						</button>
					</div>
					{expanded.has(node.name) && node.children && (
						<div className="pl-4 border-l border-gray-500">
							{renderTree(node.children, currentPath)}
						</div>
					)}
				</div>
			);
		});
	};

	return (
		<div
			className={`h-full bg-explorer-dark transition-transform ${
				isOpen ? "transform translate-x-0" : "transform -translate-x-full"
			}`}
			style={{ width: "250px" }}
		>
			<div className="h-auto ml-4 text-2x flex justify-between">
				Files
				<div className="ml-2 flex space-x-2">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleCreateNode("/", true);
						}}
						className="px-2 py-1 m-1 text-xs flex items-center"
					>
						<FontAwesomeIcon icon={faFolder} style={{ marginRight: "5px" }} />
						<FontAwesomeIcon icon={faPlus} style={{ fontSize: "12px" }} />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleCreateNode("/", false);
						}}
						className="px-2 py-1 m-1 text-xs flex items-center"
					>
						<FontAwesomeIcon icon={faFile} style={{ marginRight: "5px" }} />
						<FontAwesomeIcon icon={faPlus} style={{ fontSize: "12px" }} />
					</button>
				</div>
			</div>
			{creatingNode && (
				<div className="flex items-center p-2">
					<input
						type="text"
						ref={newNodeName}
						className="bg-gray-700 text-white px-2 py-1 flex-grow"
						placeholder="Enter name"
					/>
					<button
						onClick={handleNodeNameSubmit}
						className="px-2 py-1 m-1 text-xs flex items-center bg-green-600 hover:bg-green-700"
					>
						Create
					</button>
					<button
						onClick={handleNodeNameCancel}
						className="px-2 py-1 m-1 text-xs flex items-center bg-red-600 hover:bg-red-700"
					>
						Cancel
					</button>
				</div>
			)}
			{renderTree(tree)}
		</div>
	);
};

export default FileExplorer;
