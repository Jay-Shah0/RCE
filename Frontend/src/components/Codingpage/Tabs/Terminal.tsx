import { useWebSocket } from "@/hooks/useWebSocket";
import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface TerminalComponentProps {
	termId: string;
	data: string;
}

const TerminalComponent: React.FC<TerminalComponentProps> = ({
	termId,
	data,
}) => {
	const { socket } = useWebSocket();
	const terminalRef = useRef<HTMLDivElement | null>(null);
	const terminalInstance = useRef<Terminal | null>(null);

	const sendEvent = (action: string, cmd: string | null) => {
		if (!socket) return;

		const message = JSON.stringify({
			event: "term",
			data: { termId: termId, action: action, cmd: cmd },
		});
		socket.send(message);
	};

	useEffect(() => {
		if (!socket || terminalInstance.current) return;

		const terminal = new Terminal();
		const fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);

		if (terminalRef.current) {
			terminal.open(terminalRef.current);
			fitAddon.fit();
			terminalInstance.current = terminal;
		}

		sendEvent("start", null);

		terminal.onData((data) => {
			console.log("Terminal input:", data);
			sendEvent("cmd", data);
		});
	}, [socket, termId]);

	useEffect(() => {
		if (terminalInstance.current) {
			console.log("Writing to terminal:", data);
			terminalInstance.current.write(data);
		}
	}, [data]);

	return (
		<div className="w-full h-screen bg-black text-white">
			<div ref={terminalRef} className="h-full" />
		</div>
	);
};

export default TerminalComponent;
	