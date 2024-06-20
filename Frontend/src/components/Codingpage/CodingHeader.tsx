// Header.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faPlay, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	toggleSidebar: () => void;
}

const CodingHeader: React.FC<HeaderProps> = ({ toggleSidebar }) => {
	const navigate = useNavigate();

	return (
		<div className="bg-gray-800 text-white p-4 flex items-center justify-between w-full h-[10vh]">
			<button
				onClick={toggleSidebar}
				className="bg-blue-500 text-white p-2 mx-1 rounded"
			>
				<FontAwesomeIcon icon={faBars} />
			</button>
			<button
				onClick={() => navigate("/")}
				className="bg-blue-500 text-white p-2 mx-1 rounded"
			>
				<FontAwesomeIcon icon={faHome} />
			</button>
			<button
				onClick={toggleSidebar}
				className="bg-blue-500 text-white p-2 mx-1 rounded"
			>
				repl name
			</button>
			<button
				onClick={toggleSidebar}
				className="bg-blue-500 text-white p-2 mx-1 rounded"
			>
				repl resources
			</button>
			<div className="flex items-center justify-center flex-grow">
				<button
					onClick={toggleSidebar}
					className="bg-green-800 text-white p-2 mx-1 rounded"
				>
					<FontAwesomeIcon icon={faPlay} /> run
				</button>
			</div>
			<button
				onClick={toggleSidebar}
				className="bg-green-800 text-white p-2 mx-1 rounded"
			>
				Invite
			</button>
			<button 
				onClick={() => navigate("/User")} 
				className="text-2xl mx-1"
			>
				<FontAwesomeIcon icon={faUser} />
			</button>
		</div>
	);
};

export default CodingHeader;
