import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "@/components/Dropdown";
import Replbar from "@/components/Replbar";

const Homepage: React.FC = () => {

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
				<div className="md:p-48">
					<div className="flex gap-6">
						<button className="w-30 px-4 py-2 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center">
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Create Repl
						</button>
						<a
							href="#"
							className={
								"w-60 px-4 border-2 mb-2 flex justify-center items-center hover:bg-gray-800 cursor-pointer"
							}
							style={{ color: "#FFFF" }}
						>
							Create Python
						</a>
						<a
							href="#"
							className={
								"w-60 px-4 border-2 mb-2 flex justify-center items-center hover:bg-gray-800 cursor-pointer"
							}
							style={{ color: "#FFFF" }}
						>
							Create Javascript
						</a>
					</div>
					<div className="py-4 flex justify-between">
							<div className="text-2xl">Recent Repls</div>
							<Dropdown />
					</div>
					<div className="p-4">
						<Replbar/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Homepage;
