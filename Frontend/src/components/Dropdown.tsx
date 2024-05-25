import { useState } from "react";

const Dropdown = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative inline-block text-center">
			<a
				href="#"
				onClick={toggleDropdown}
				className="inline-flex w-full px-4 py-2 text-sm bg-gray-700 rounded-xl hover:bg-gray-500 cursor-pointer"
				style={{ color: "#FFFF" }}
			>
				Dropdown
				<svg
					className="w-5 h-5 ml-2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</a>
			{isOpen && (
				<div className="absolute left-1/2 transform -translate-x-1/2 w-36 mt-2  bg-gray-700 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div
						className="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						<a
							href="#"
							className="block px-4 py-2 text-sm hover:bg-gray-500"
							style={{ color: "#FFFF" }}
						>
							All Repls
						</a>
						<a
							href="#"
							className="block px-4 py-2 text-sm hover:bg-gray-500"
							style={{ color: "#FFFF" }}
						>
							My Repls
						</a>
						<a
							href="#"
							className="block px-4 py-2 text-sm hover:bg-gray-500"
							style={{ color: "#FFFF" }}
						>
							Other Repls
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
