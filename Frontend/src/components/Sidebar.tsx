import React, { useContext, useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Replspopup from "./Replspopup";
import { PopupContext } from "@/context/PopupContext";
import Githubpopup from "./Githubpopup";

interface SidebarProps {
	isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
	const navigate = useNavigate();
	const [activeButton, setActiveButton] = useState<string | null>(null);

	const { replPopup, setReplPopup, gitPopup, setGitPopup } = useContext(PopupContext);


	const handleButtonClick = (name: string) => {
		setActiveButton(name);
		navigate(name === "Home" ? "/" : `/${name.toLowerCase()}`);
	};

	return (
		<>
			<div
				className={`h-full bg-explorer-dark transition-transform ${
					isOpen ? "transform translate-x-0" : "transform -translate-x-full"
				}`}
				style={{ width: "250px" }}
			>
				<div className="flex flex-col">
					<div className="mb-4 p-4">
						<button
							className="w-full px-4 py-2 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
							onClick={() => setReplPopup(true)}
						>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Create Repl
						</button>
						<button
							className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
							onClick={() => setGitPopup(true)}
						>
							<FontAwesomeIcon icon={faGithub} className="mr-2" />
							Import from GitHub
						</button>
					</div>
					<div>
						<a
							href="#"
							className={`w-full flex justify-center items-center px-4 py-2 ${
								activeButton === "Home"
									? "bg-gray-800 text-white hover:cursor-pointer"
									: "hover:bg-gray-800 cursor-pointer"
							}`}
							style={{ color: "#FFFF" }}
							onClick={() => handleButtonClick("Home")}
						>
							Home
						</a>
						<a
							href="#"
							className={`w-full flex justify-center items-center px-4 py-2 ${
								activeButton === "Repls"
									? "bg-gray-800 hover:cursor-pointer"
									: "hover:bg-gray-800 cursor-pointer"
							}`}
							style={{ color: "#FFFF" }}
							onClick={() => handleButtonClick("Repls")}
						>
							Repls
						</a>
						<a
							href="#"
							className={`w-full flex justify-center items-center px-4 py-2 ${
								activeButton === "Deployments"
									? "bg-gray-800 text-white hover:cursor-pointer"
									: "hover:bg-gray-800 cursor-pointer"
							}`}
							style={{ color: "#FFFF" }}
							onClick={() => handleButtonClick("Deployments")}
						>
							Deployments
						</a>
						<a
							href="#"
							className={`w-full flex justify-center items-center px-4 py-2 ${
								activeButton === "Teams"
									? "bg-gray-800 text-white hover:cursor-pointer"
									: "hover:bg-gray-800 cursor-pointer"
							}`}
							style={{ color: "#FFFF" }}
							onClick={() => handleButtonClick("Teams")}
						>
							Teams
						</a>
					</div>
				</div>
			</div>
			{replPopup && <Replspopup onClose={() => setReplPopup(false)} />}
			{gitPopup && <Githubpopup onClose={() => setGitPopup(false)} />}
		</>
	);
};

export default Sidebar;
