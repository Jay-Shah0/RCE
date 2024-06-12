// Header.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface HeaderProps {
	toggleSidebar: () => void;
}

const Codingheader: React.FC<HeaderProps> = ({ toggleSidebar }) => {
	return (
		<div className="bg-gray-800 text-white p-4 flex items-center justify-between fixed w-full z-10">
			<button
				onClick={toggleSidebar}
				className="bg-blue-500 text-white p-2 rounded"
			>
				<FontAwesomeIcon icon={faBars} />
			</button>
			<div className="flex items-center justify-center flex-grow">
				<div className="max-w-[600px] w-full">
					<input
						type="text"
						placeholder="Search..."
						className="bg-white text-black p-2 rounded-md border border-gray-300 w-full"
					/>
				</div>
			</div>
			<div className="text-2xl ml-auto">
				{" "}
				<Link to="/User">
					<FontAwesomeIcon icon={faUser} />
				</Link>
			</div>
		</div>
	);
};

export default Codingheader;
