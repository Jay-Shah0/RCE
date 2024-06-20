import React, { createContext, useEffect, useState, ReactNode, useRef } from "react";

interface WebSocketContextProps {
	socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
	undefined
);

export const WebSocketProvider: React.FC<{
	replID: string;
	children: ReactNode;
}> = ({ children, replID }) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const isRender = useRef(false);

	useEffect(() => {
		if (isRender.current) return;
		isRender.current = true;
		const ws = new WebSocket("ws://localhost:8099/client");

		ws.onopen = () => {
			console.log(`Connected to WebSocket server with replID: ${replID}`);
			ws.send(JSON.stringify({ replID }));
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		ws.onclose = (event) => {
			console.log("WebSocket connection closed:", event);
		};

		setSocket(ws);

	}, [replID]);

	return (
		<WebSocketContext.Provider value={{ socket }}>
			{children}
		</WebSocketContext.Provider>
	);
};

export default WebSocketContext;
