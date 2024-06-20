import React, { useState } from "react";
import CodingArea from "@/components/Codingpage/CodingArea";
import CodingHeader from "@/components/Codingpage/CodingHeader";
import FileExplorer from "@/components/Codingpage/FileExplorer";
import Tabs from "@/components/Codingpage/Tabs";
import { WebSocketProvider } from "@/context/WebSocketContext";

const Codingpage: React.FC<{ replID: string }> = ({ replID="1" }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

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

	return (
		<WebSocketProvider replID={replID}>
			<div className="relative h-screen">
				<CodingHeader toggleSidebar={toggleSidebar} />
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
							<Tabs />
						</div>
					</div>
				</div>
			</div>
		</WebSocketProvider>
	);
};

export default Codingpage;
