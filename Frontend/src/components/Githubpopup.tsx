import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

interface popupProps {
	onClose: () => void;
}

const Githubpopup: React.FC<popupProps> = ({onClose}) => {

	const handleRepoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-custom-dark p-6 rounded-lg shadow-lg w-3/4 my-16 h-max md:w-1/2 lg:w-1/2 relative">
				<div className="flex justify-between items-center mb-4">
					<div className="text-3xl font-semibold">Import from Github</div>
					<button
						className=" size-6 ml-3 mb-5 justify-center rounded hover:bg-gray-700"
						onClick={onClose}
					>
						<FontAwesomeIcon icon={faTimes} className="text-2xl" />
					</button>
				</div>
				<div>
					<div className="text-1xl font-medium mb-2">Repository URL</div>
					<input
						type="text"
						className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
						placeholder="GitHub Repository URL"
						onChange={handleRepoSearch}
					/>
				</div>
			</div>
		</div>
	);
};

export default Githubpopup