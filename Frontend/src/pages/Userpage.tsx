// Userpage.tsx
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Userpage: React.FC = () => {
	const { user } = useContext(UserContext);

	const handleSignInWithGoogle = () => {
		window.location.href = "http://localhost:8080/auth/google/login";
	};

	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	const [activeButton, setActiveButton] = useState<string | null>(null);

	const handleButtonClick = (name: string) => {
		setActiveButton(name); 
	};

	const renderContent = () => {
		switch (activeButton) {
			case "Button 1":
				return <div>repls</div>;
			case "Button 2":
				return <div>community</div>;
			default:
				return null;
		}
	};

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
					<div className="flex justify-center mt-8 text-white">
						<div className="w-full max-w-6xl">
							{user ? (
								<div className="flex flex-col md:flex-row mt-4 gap-x-10">
									<div className="w-full md:w-1/3 mb-4 md:mb-0">
										<div className="relative w-full h-100 bg-gray-300 rounded-xl">
											{/* Banner Image */}
											<img
												src="https://via.placeholder.com/600x200"
												alt="Banner"
												className="object-cover w-full h-full rounded-xl"
											/>
											{/* Profile Image */}
											<div className="absolute inset-0 flex justify-start items-end pl-4">
												<img
													src="https://via.placeholder.com/100"
													alt="Profile"
													className="w-24 h-24 rounded-full border-4 border-white -mb-12"
												/>
											</div>
										</div>
										<div className="mt-12 p-4 grid grid-cols-1 gap-y-4">
											<h2 className="text-2xl font-bold">{user.username}</h2>
											<p className="text-lg">{user.email}</p>
											<p>Followers: 0 Following: 0</p>
											<p className="text-sm">
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											</p>
											{/* Add more profile information here */}
										</div>
									</div>
									<div className="w-full md:w-2/3 flex flex-col">
										<div className="flex border-b gap-3">
											<ButtonComponent
												name="Public repls"
												active={activeButton === "Button 1"}
												onClick={() => handleButtonClick("Button 1")}
											/>
											<ButtonComponent
												name="Community"
												active={activeButton === "Button 2"}
												onClick={() => handleButtonClick("Button 2")}
											/>
										</div>
										<div className="mt-4">{renderContent()}</div>
									</div>
								</div>
							) : (
								<div className="flex justify-center">
									<button
										className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
										onClick={handleSignInWithGoogle}
									>
										Sign in with Google
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Userpage;

const ButtonComponent: React.FC<{
	name: string;
	active: boolean;
	onClick: () => void;
}> = ({ name, active, onClick }) => {
	return (
		<button
			className={`text-2xl bg-gray-700 border-b-2 rounded-t
                  hover:bg-gray-500 focus:outline-none
                ${active ? " border-b-blue-500" : ""}
            `}
			onClick={onClick}
		>
			{name}
		</button>
	);
};

