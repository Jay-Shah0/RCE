import React, { useContext, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "@/components/Dropdown";
import Replbar from "@/components/Replbar";
import { PopupContext } from "@/context/PopupContext";
import { UserContext, UserContextState } from "@/context/UserContext";

const Homepage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const { setReplPopup } = useContext(PopupContext);
	const { user } = useContext<UserContextState>(UserContext);


	return (
		<div className="relative min-h-screen">
			<Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<Sidebar isOpen={isSidebarOpen} />
			<div
				className={`transition-all duration-300 pt-16 ${
					isSidebarOpen ? "ml-64" : "ml-0"
				}`}
			>
				<div className="p-4 md:px-48 py-32">
					<div className="flex gap-6">
						<button
							className="w-30 px-4 py-2 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
							onClick={() => setReplPopup(true)}
						>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Create Repl
						</button>
						<a
							href="#"
							className={
								"w-60 px-4 border-2 mb-2 flex justify-center items-center"
							}
						>
							Create Python
						</a>
						<a
							href="#"
							className={
								"w-60 px-4 border-2 mb-2 flex justify-center items-center"
							}
						>
							Create Javascript
						</a>
					</div>
					<div className="py-4 flex justify-between">
						<div className="text-2xl">Recent Repls</div>
						<Dropdown />
					</div>
					<div className="p-4">
						{user ? (
							<Replbar /> // Render Replbar component if user is logged in
						) : (
							<div className="flex items-center justify-center h-full">
								<div className="animate-spin rounded-full border-b-2 border-gray-200 w-8 h-8"></div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Homepage;
