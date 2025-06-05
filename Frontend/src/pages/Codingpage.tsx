import React, { useEffect, useRef, useState } from "react";
import CodingArea from "@/components/Codingpage/CodingArea";
import CodingHeader from "@/components/Codingpage/CodingHeader";
import FileExplorer from "@/components/Codingpage/FileExplorer";
import Tabs from "@/components/Codingpage/Tabs";
import { useLocation } from "react-router-dom";
import { FileNode, FileTreeSocketMessage, TermSocketMessage } from "@/utils/socketEventInterface";
import { CodingContextProvider } from "@/context/CodingContext";
import { useCoding } from "@/hooks/useCoding";

const CodingpageContent: React.FC = () => {
	const { workerStart, socket, setSelectedFileContent } = useCoding();

	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
	const [termMsg, setTermMsg] = useState<TermSocketMessage | null>(null);
	const [fileTree, setFileTree] = useState<FileNode[] | null>(null);
	const chunks = useRef<string[]>([]);

	// Function to build the file tree from the socket message
	function buildFileTree(fileInfo: FileTreeSocketMessage[]): FileNode[] {
		// Helper function to find or create a node in the tree
		const findOrCreateNode = (nodes: FileNode[], name: string): FileNode => {
			let node = nodes.find((n) => n.name === name);
			if (!node) {
				node = { name, children: undefined }; 
				nodes.push(node);
			}
			return node;
		};

		const root: FileNode[] = [];

		fileInfo.forEach((info) => {
			const parts = info.path.split("/"); 
			let currentLevel = root;

			parts.forEach((part, index) => {
				const isLast = index === parts.length - 1;

				const node = findOrCreateNode(currentLevel, part);

				if (isLast) {
					node.name = info.name; 
				}

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
	
	//socket connection logic and initial file tree load
	useEffect(() => {
		if (socket && workerStart) {
			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data) {
						if (data.event === "term") {
							if (data.output !== undefined) {
								console.log("Setting termData: ", data.output);
								setTermMsg(data);
							}
						}
						if (data.event === "filetree") {
							const files: FileTreeSocketMessage[] = data.files;
							setFileTree(buildFileTree(files));
							console.log(buildFileTree(files));
						}
						if (data.event === "file") {
							if (data.dataType === "error") {
								if (data.chunk) {
									console.log(data.chunk);
								}
								if (data.data) {
									console.log(data.data);
								}
							}
							if (data.dataType === "fileChunk") {
								chunks.current = [...chunks.current, data.chunk];
							}
							if (data.dataType === "fileEnd") {
								setSelectedFileContent(chunks.current.join(""));
								console.log(chunks.current.join(""));
								chunks.current = [];
							}
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
			socket.send(message);
		}
	}, [socket, workerStart, setSelectedFileContent]);


	if (!socket || !workerStart || !fileTree) {
		return <div>Loading data...</div>;
	}

	return (
		<div className="relative h-screen w-screen">
			<CodingHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<div className="relative h-[90vh] w-full">
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
		<CodingContextProvider replId={replId}>
			<CodingpageContent />
		</CodingContextProvider>
	);
};

export default Codingpage;
