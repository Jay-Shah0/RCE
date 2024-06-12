import React, { useState, useEffect, useRef } from "react";

// interface EventData {
// 	output: string;
// 	currentDir: string;
// }

const Terminal: React.FC = () => {
	const [output, setOutput] = useState<string[]>([]);
	const [currentDir, setCurrentDir] = useState("/")
	const [input, setInput] = useState<string>("");
	const wsRef = useRef<WebSocket | null>(null);
	const terminalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8099/ws");
		wsRef.current = ws;

		ws.onmessage = (event) => {
			const dataString = event.data;
			let eventData;
			
			try {
				eventData = JSON.parse(dataString);
			} catch (error) {
				console.error("Error parsing JSON:", error);
				return;
			}

			if (!("output" in eventData && "currentDir" in eventData)) {
				console.error("Received data doesn't match EventData interface");
				return;
			}

			setOutput((prevMessages) => [...prevMessages, eventData.output]);
			setCurrentDir(eventData.currentDir)
		};

		ws.onerror = () => {
			setOutput((prevMessages) => [
				...prevMessages,
				"Error: WebSocket connection failed",
			]);
		};

		ws.onclose = () => {
			setOutput((prevMessages) => [
				...prevMessages,
				"WebSocket connection closed",
			]);
		};

		return () => {
			ws.close();
		};
	}, []);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [output]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	};

	const handleInputKeyPress = (
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (event.key === "Enter" && input.trim() !== "") {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				wsRef.current.send(input);
				setOutput((prevMessages) => [...prevMessages, `${currentDir + input}`]);
				setInput("");
			} else {
				setOutput((prevMessages) => [
					...prevMessages,
					"Error: WebSocket connection is not open",
				]);
			}
		}
	};

	return (
		<div
			className="bg-black text-white font-mono p-4 h-screen flex flex-col"
			ref={terminalRef}
		>
			<div className="flex-grow overflow-y-auto">
				{output.map((msg, index) => (
					<div key={index} className="whitespace-pre-wrap break-words">
						{msg}
					</div>
				))}
				<span>{currentDir}</span>
				<input
					type="text"
					value={input}
					onChange={handleInputChange}
					onKeyPress={handleInputKeyPress}
					className="bg-transparent border-none text-white outline-none flex-grow"
					autoFocus
				/>
			</div>
		</div>
	);
};

export default Terminal;
