import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

const Teampage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="relative h-screen">
			<Header toggleSidebar={toggleSidebar} />
			<div className="relative h-[90vh]">
				<div className="h-full w-fit absolute">
					<Sidebar isOpen={isSidebarOpen} />
				</div>
				<div
					className={`transition-all duration-300 ${
						isSidebarOpen ? "ml-64" : "ml-0"
					}`}
				>
					<div>Teampage</div>
				</div>
			</div>
		</div>
	);
};

export default Teampage;
