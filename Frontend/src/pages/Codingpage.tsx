import React, { useEffect, useState } from "react";
import CodingArea from "@/components/Codingpage/CodingArea";
import CodingHeader from "@/components/Codingpage/CodingHeader";
import FileExplorer from "@/components/Codingpage/FileExplorer";
import Tabs from "@/components/Codingpage/Tabs";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { useLocation } from "react-router-dom";
import { useWebSocket } from "@/hooks/useWebSocket";
import { FileNode, FileTreeSocketMessage, TermSocketMessage } from "@/utils/socketEventInterface";

const CodingpageContent: React.FC = () => {
	const { workerStart, socket } = useWebSocket();
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
	const [termMsg, setTermMsg] = useState<TermSocketMessage | null>(null);
	const [fileTree, setFileTree] = useState<FileNode[] | null>(null);

	const [selectedFileContent, setSelectedFileContent] = useState<string>(
		"Initial file content..."
	);
	const [selectedFileName, setSelectedFileName] =
		useState<string>("example.txt");

	const handleContentChange = (newContent: string) => {
		setSelectedFileContent(newContent);
	};

	function buildFileTree(fileInfo: FileTreeSocketMessage[]): FileNode[] {
		// Helper function to find or create a node in the tree
		const findOrCreateNode = (nodes: FileNode[], name: string): FileNode => {
			let node = nodes.find((n) => n.name === name);
			if (!node) {
				node = { name, children: undefined }; // Set children to undefined for files
				nodes.push(node);
			}
			return node;
		};

		// Create a root node array to hold the structure
		const root: FileNode[] = [];

		fileInfo.forEach((info) => {
			const parts = info.path.split("/"); // Split the path into parts
			let currentLevel = root;

			parts.forEach((part, index) => {
				const isLast = index === parts.length - 1;

				// Find or create the current node
				const node = findOrCreateNode(currentLevel, part);

				if (isLast) {
					node.name = info.name; // Ensure the name is set correctly
				}

				// If it's a directory and not the last part, navigate deeper
				if (!isLast) {
					if (!node.children) {
						node.children = [];
					}
					currentLevel = node.children;
				}
			});
		});

		return root;
	}

	
	useEffect(() => {
		if (socket && workerStart) {
			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data) {
						if(data.event === "term"){
							if(data.output !== undefined){
								console.log("Setting termData: ", data.output);
								setTermMsg(data);
							}
						}
						if (data.event === "filetree") {
							const files: FileTreeSocketMessage[] = data.files;
							setFileTree(buildFileTree(files));
							console.log(buildFileTree(files));
						}
					} else {
						console.error("Invalid data received:", data);
					}
				} catch (e) {
					console.error("Failed to parse data:", event.data, e);
				}
			};

			const message = JSON.stringify({
				event: "filetree",
				data: { action: "open" },
			});
			socket.send(message)
		}
	}, [socket, workerStart]);

	if (!socket || !workerStart || !fileTree) {
		return <div>Loading data...</div>;
	}

	return (
		<div className="relative h-screen">
			<CodingHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<div className="relative h-[90vh]">
				<div className="absolute h-full w-64">
					<FileExplorer initialTree={fileTree} isOpen={isSidebarOpen} />
				</div>
				<div
					className={`flex flex-row h-full transition-all duration-300 ${
						isSidebarOpen ? "ml-64" : "ml-0"
					}`}
				>
					<div className="h-full w-3/5">
						<CodingArea
							fileContent={selectedFileContent}
							fileName={selectedFileName}
							onContentChange={handleContentChange}
						/>
					</div>
					<div className="h-full w-2/5">
						<Tabs data={termMsg} />
					</div>
				</div>
			</div>
		</div>
	);
};

const Codingpage: React.FC = () => {
	const location = useLocation();
	const [replId, setReplId] = useState<string | null>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const userId = urlParams.get("replId");
		setReplId(userId);
	}, [location]);

	if (!replId) {
		return <div>...</div>;
	}

	return (
		<WebSocketProvider replId={replId}>
			<CodingpageContent />
		</WebSocketProvider>
	);
};

export default Codingpage;
