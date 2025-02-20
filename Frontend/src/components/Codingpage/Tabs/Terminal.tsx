import { useCoding } from "@/hooks/useCoding";
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
	const { socket } = useCoding();
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

	const sendResizeEvent = (rows: number, cols: number) => {
		if (!socket) return;

		const message = JSON.stringify({
			event: "term",
			data: { termId: termId, action: "resize", rows: rows, cols: cols },
		});
		socket.send(message);
	};

	useEffect(() => {
		const terminal = new Terminal();
		const fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);

		if (terminalRef.current) {
			terminal.open(terminalRef.current);
			fitAddon.fit();
			terminalInstance.current = terminal;

			const { cols, rows } = terminal;
			sendResizeEvent(cols, rows);
		}

		sendEvent("start", null);

		terminal.onData((data) => {
			console.log("Terminal input:", data);
			sendEvent("cmd", data);
		});

		const handleResize = () => {
			fitAddon.fit();
			if (terminalInstance.current) {
				const { cols, rows } = terminalInstance.current;
				sendResizeEvent(cols, rows);
			}
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			terminal.dispose();
			terminalInstance.current = null;
		};
	}, [socket, termId]);

	useEffect(() => {
		if (terminalInstance.current) {
			console.log("Writing to terminal:", data);
			terminalInstance.current.write(data);
		}
	}, [data]);

	return (
		<div className="w-full bg-black text-white flex flex-col h-full">
			<div ref={terminalRef} className="flex-grow h-full" />
		</div>
	);
};

export default TerminalComponent;
