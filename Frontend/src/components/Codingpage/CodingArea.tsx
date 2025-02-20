import { useCoding } from "@/hooks/useCoding";
import React from "react";

const CodingArea: React.FC = () => {
	const { selectedFileContent, selectedFileName, setSelectedFileContent } =
		useCoding();

	const handleContentChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setSelectedFileContent(event.target.value);
	};


	return (
		<div className="w-full h-full px-4 text-white">
			{selectedFileName !== null && (
				<h2 className="text-xl h-[5vh]">{selectedFileName}</h2>
			)}
			{selectedFileContent !== null && (
				<textarea
					className="w-full h-[85vh] p-2 bg-gray-900 text-white border border-gray-700 rounded"
					value={selectedFileContent}
					onChange={handleContentChange}
				/>
			)}
		</div>
	);
};

export default CodingArea;
