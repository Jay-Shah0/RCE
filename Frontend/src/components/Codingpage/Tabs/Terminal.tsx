import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useRef, useState } from "react";


const Terminal: React.FC = () => {
	const [output, setOutput] = useState<string[]>([]);
	const [currentDir, setCurrentDir] = useState("/");
	const [input, setInput] = useState<string>("");
	const { socket } = useWebSocket();
	const terminalRef = useRef<HTMLDivElement | null>(null);
	

	useEffect(() => {
		if (!socket) {
			return
		}
		return () => {
			socket.close();
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

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.onmessage = (event) => {
			console.log("Received message from WebSocket:", event.data);
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
			console.log(eventData);
			setOutput((prevMessages) => [...prevMessages, eventData.output]);
			setCurrentDir(eventData.currentDir + "/");
		};

		socket.onerror = () => {
			setOutput((prevMessages) => [
				...prevMessages,
				"Error: WebSocket connection failed",
			]);
		};

		socket.onclose = () => {
			setOutput((prevMessages) => [
				...prevMessages,
				"WebSocket connection closed",
			]);
		};
	})
	

	const handleInputKeyPress = (
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (event.key === "Enter" && input.trim() !== "") {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(input);
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
			className="bg-black text-white font-mono p-4 h-[90vh] flex flex-col"
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
