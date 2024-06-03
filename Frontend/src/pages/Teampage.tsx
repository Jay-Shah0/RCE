import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

const Teampage: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [replPopup, setReplPopup] = useState<boolean>(false);

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

	return (
		<div className="relative min-h-screen">
			<Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<Sidebar
				isOpen={isSidebarOpen}
				popUpCerateRepl={() => setReplPopup(true)}
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
