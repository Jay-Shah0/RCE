import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

const Teampage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	return (
		<div className="relative min-h-screen">
			<Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<Sidebar
				isOpen={isSidebarOpen}
			/>
			<div
				className={`transition-all duration-300 pt-16 ${
					isSidebarOpen ? "ml-64" : "ml-0"
				}`}
			>
				<div>Teampage</div>
			</div>
		</div>
	);
};

export default Teampage;
