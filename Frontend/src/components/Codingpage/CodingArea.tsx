import React, { useState, ChangeEvent, useEffect } from "react";

interface CodingAreaProps {
	fileContent: string;
	fileName: string;
	onContentChange: (content: string) => void;
}

const CodingArea: React.FC<CodingAreaProps> = ({
	fileContent,
	fileName,
	onContentChange,
}) => {
	const [content, setContent] = useState(fileContent);

	useEffect(() => {
		setContent(fileContent);
	}, [fileContent]);

	const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = event.target.value;
		setContent(newContent);
		onContentChange(newContent);
	};

	return (
		<div className="w-full h-full px-4 text-white">
			{fileName && <h2 className="text-xl h-[5vh]">{fileName}</h2>}
			<textarea	
				className="w-full h-[85vh] p-2 bg-gray-900 text-white border border-gray-700 rounded"
				value={content}
				onChange={handleContentChange}
				spellCheck="false"
			/>
		</div>
	);
};

export default CodingArea;
