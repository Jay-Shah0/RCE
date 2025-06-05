import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useEffect, useState, ReactNode, useRef } from "react";

interface WebSocketContextProps {
	socket: WebSocket | null;
	workerStart: boolean;
	selectedFileContent: string | null;
	setSelectedFileContent: React.Dispatch<React.SetStateAction<string | null>>;
	selectedFileName: string | null;
	setSelectedFileName: React.Dispatch<React.SetStateAction<string | null>>;
}

const CodingContext = createContext<WebSocketContextProps | undefined>(
	undefined
);

export const CodingContextProvider: React.FC<{
	replId: string;
	children: ReactNode;
}> = ({ children, replId }) => {

	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [workerStart, setWorkerStart] = useState<boolean>(false);
	const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
	const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);

	const isRender = useRef(false);
	const wsRef = useRef<WebSocket | null>(null);

	const startWorker = async (id: string) => {
		try {
				const accessToken = Cookies.get("access_token");

				if (!accessToken) {
					throw new Error("Access token not found in cookies");
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
			const accessToken = Cookies.get("access_token");

			if (!accessToken) {
				throw new Error("Access token not found in cookies");
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
		wsRef.current = ws;

		ws.onopen = () => {
			console.log(`Connected to WebSocket server with replID: ${replId}`);
			ws.send(JSON.stringify({ replId }));
			setSocket(ws); // for use elsewhere if needed
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			setSocket(null);
		};

		ws.onclose = (event) => {
			console.log("WebSocket connection closed:", event);
			setSocket(null);
		};

		startWorker(replId);

		return () => {
			if (wsRef.current?.readyState === WebSocket.OPEN) {
				wsRef.current.close(1000);
			}
			stopWorker(replId);
		};
	}, []);

	return (
		<CodingContext.Provider
			value={{
				socket,
				workerStart,
				selectedFileName,
				setSelectedFileName,
				selectedFileContent,
				setSelectedFileContent,
			}}
		>
			{children}
		</CodingContext.Provider>
	);
};

export default CodingContext;
