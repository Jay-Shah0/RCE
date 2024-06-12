import Codingheader from "@/components/Codingpage/Codingheader";
import Terminal from "@/components/Codingpage/Terminal";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

const Codingpage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="relative min-h-screen">
			<Codingheader toggleSidebar={toggleSidebar} />
			<Sidebar isOpen={isSidebarOpen} />
			<div
				className={`transition-all duration-300 pt-16 ${
					isSidebarOpen ? "ml-64" : "ml-0"
				}`}
			>
				<div className="flex-row">
					<div className="h-full overflow-x-scroll">
						<Filetree />
					</div>
					<div className="h-full overflow-x-scroll">
						<Codingarea />
					</div>
					<div className="h-full">
						<Tabs />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Codingpage;
