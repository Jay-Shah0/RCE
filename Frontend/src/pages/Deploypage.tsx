import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

const Deploypage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="relative min-h-screen">
			<Header toggleSidebar={toggleSidebar} />
			<Sidebar isOpen={isSidebarOpen} />
			<div
				className={`transition-all duration-300 pt-16 ${
					isSidebarOpen ? "ml-64" : "ml-0"
				}`}
			>
				<div>Deploypage</div>
			</div>
		</div>
	);
};

export default Deploypage;
