import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode, useRef } from "react";

interface WebSocketContextProps {
	socket: WebSocket | null;
	workerStart: boolean;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
	undefined
);

export const WebSocketProvider: React.FC<{
	replId: string;
	children: ReactNode;
}> = ({ children, replId }) => {

	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [workerStart, setWorkerStart] = useState<boolean>(false)
	const isRender = useRef(false);

	const startWorker = async (id: string) => {
		try {
				const accessToken = localStorage.getItem("access_token");

				if (!accessToken) {
					throw new Error("Access token not found in local storage");
				}

				const body: {
					repl: { id: string };
				} = {
					repl: {
						id: id,
					},
				};

				console.log(body);

				const headers = { Authorization: `Bearer ${accessToken}` };

				// Send POST request using axios
				const response = await axios.post(
					"http://localhost:3000/api/repl/open",
					body,
					{ headers }
				);
				setWorkerStart(true)
				console.log(response)
			
			} catch (error) {
			console.error("Error deleting repl:", error);
			}
	};

	const stopWorker = async ( id:string ) => {
		try {
			const accessToken = localStorage.getItem("access_token");

			if (!accessToken) {
				throw new Error("Access token not found in local storage");
			}

			const body: {
				repl: { id: string };
			} = {
				repl: {
					id: id,
				},
			};

			console.log(body);

			const headers = { Authorization: `Bearer ${accessToken}` };

			// Send POST request using axios
			const response = await axios.post(
				"http://localhost:3000/api/repl/close",
				body,
				{ headers }
			);
			setWorkerStart(false);
			console.log(response);

		} catch (error) {
			console.error("Error deleting repl:", error);
		}
	}

	useEffect(() => {
		if (isRender.current) return;
		isRender.current = true;
		const ws = new WebSocket("ws://localhost:8099/client");

		ws.onopen = () => {
			console.log(`Connected to WebSocket server with replID: ${replId}`);
			ws.send(JSON.stringify({ replId }));
			setSocket(ws);	
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			setSocket(null);
		};

		ws.onclose = (event) => {
			console.log("WebSocket connection closed:", event);
			setSocket(null);
		};
		setSocket(ws);

		startWorker(replId)

		return () => {
			if(socket) ws.close(1000);
			stopWorker(replId)
		}
	}, []);

	return (
		<WebSocketContext.Provider value={{ socket, workerStart }}>
			{children}
		</WebSocketContext.Provider>
	);
};

export default WebSocketContext;
