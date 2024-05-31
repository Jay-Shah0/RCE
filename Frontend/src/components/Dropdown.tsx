import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Dropdown = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative inline-block text-center">
			<button
				onClick={toggleDropdown}
				className="inline-flex w-full px-4 py-2 text-sm bg-gray-700 rounded-xl hover:bg-gray-500 cursor-pointer"
				style={{ color: "#FFFF" }}
			>
				Dropdown
				{isOpen ? (
					<FontAwesomeIcon
						icon={faChevronUp}
						className="pl-3 mt-1 text-white"
					/>
				) : (
					<FontAwesomeIcon
						icon={faChevronDown}
						className="pl-3 mt-1 text-white"
					/>
				)}
			</button>
			{isOpen && (
				<div className="absolute left-1/2 transform -translate-x-1/2 w-36 mt-2  bg-gray-700 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div
						className="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						<a className="block px-4 py-2 text-sm hover:bg-gray-500">
							All Repls
						</a>
						<a href="#" className="block px-4 py-2 text-sm hover:bg-gray-500">
							My Repls
						</a>
						<a href="#" className="block px-4 py-2 text-sm hover:bg-gray-500">
							Other Repls
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
