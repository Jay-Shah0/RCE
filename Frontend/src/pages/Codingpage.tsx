import React, { useEffect, useState } from "react";
import CodingArea from "@/components/Codingpage/CodingArea";
import CodingHeader from "@/components/Codingpage/CodingHeader";
import FileExplorer from "@/components/Codingpage/FileExplorer";
import Tabs from "@/components/Codingpage/Tabs";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { useLocation } from "react-router-dom";
import { useWebSocket } from "@/hooks/useWebSocket";
import { SocketMessage } from "@/utils/socketEventInterface";

const CodingpageContent: React.FC = () => {
	const { workerStart, socket } = useWebSocket();
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
	const [termMsg, setTermMsg] = useState<SocketMessage | null>(null);

	const fileTree = [
		{
			name: "src",
			children: [
				{ name: "components", children: [{ name: "FileExplorer.tsx" }] },
				{ name: "App.tsx" },
				{ name: "main.tsx" },
			],
		},
		{
			name: "public",
			children: [{ name: "index.html" }],
		},
		{ name: "package.json" },
	];

	const [selectedFileContent, setSelectedFileContent] = useState<string>(
		"Initial file content..."
	);
	const [selectedFileName, setSelectedFileName] =
		useState<string>("example.txt");

	const handleContentChange = (newContent: string) => {
		setSelectedFileContent(newContent);
	};

	useEffect(() => {
		if (socket && workerStart) {
			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data && data.output !== undefined) {
						if(data.event === "term"){
							console.log("Setting termData: ", data.output);
							setTermMsg(data);
						}
					} else {
						console.error("Invalid data received:", data);
					}
				} catch (e) {
					console.error("Failed to parse data:", event.data, e);
				}
			};
		}
	}, [socket, workerStart]);

	if (!socket || !workerStart) {
		return <div>Loading data...</div>;
	}

	return (
		<div className="relative h-screen">
			<CodingHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<div className="relative h-[90vh]">
				<div className="absolute h-full w-64">
					<FileExplorer tree={fileTree} isOpen={isSidebarOpen} />
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
