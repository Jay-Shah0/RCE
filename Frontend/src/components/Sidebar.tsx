import React, { useContext, useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; 
import Replspopup from "./Replspopup";
import axios from "axios";
import { PopupContext } from "@/context/PopupContext";

interface SidebarProps {
	isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
	const navigate = useNavigate();
	const [activeButton, setActiveButton] = useState<string | null>(null);

	const { isPopupOpen, setIsPopupOpen } = useContext(PopupContext);

	const CreateRepl = async (
		replTemplate: string,
		replName: string,
		isPublic: boolean
	) => {
		try {
			// Retrieve access token from local storage
			const accessToken = localStorage.getItem("access_token");

			if (!accessToken) {
				throw new Error("Access token not found in local storage");
			}

			// Prepare request body with repl details
			const replData: {
				repl: { replName: string; replTemplate: string; isPublic: boolean };
			} = {
				repl: {
					replName: replTemplate,
					replTemplate: replName,
					isPublic: isPublic,
				},
			};

			console.log(replData);

			// Set headers with Bearer token for authentication
			const headers = { Authorization: `Bearer ${accessToken}` };

			// Send POST request using axios
			const response = await axios.post(
				"http://localhost:3000/api/repl/create",
				replData,
				{ headers }
			);

			// Handle successful response
			console.log("Repl created successfully:", response.data);
		} catch (error) {
			console.error("Error creating repl:", error);
		}
	};

	const handleButtonClick = (name: string) => {
		setActiveButton(name);
		navigate(name === "Home" ? "/" : `/${name.toLowerCase()}`);
	};

	return (
		<>
			<div
				className={`fixed top-16 left-0 mt-4 h-full border-r-2 border-gray-300 transition-transform ${
					isOpen ? "transform translate-x-0" : "transform -translate-x-full"
				}`}
				style={{ width: "250px" }}
			>
				<div className="flex flex-col">
					<div className="mb-4 p-4">
						<button
							className="w-full px-4 py-2 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center justify-center"
							onClick={() => setIsPopupOpen(true)}
						>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
							Create Repl
						</button>
						<button
							className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
							onClick={() => navigate("/github")}
						>
							<FontAwesomeIcon icon={faGithub} className="mr-2" />
							Import from GitHub
						</button>
					</div>

					{/* New div for additional buttons */}
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
			{isPopupOpen && (
				<Replspopup
					onClose={() => setIsPopupOpen(false)}
					createRepl={CreateRepl}
				/>
			)}
		</>
	);
};

export default Sidebar;
