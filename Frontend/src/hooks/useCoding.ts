import CodingContext from "@/context/CodingContext";
import { useContext } from "react";

export const useCoding = () => {
	const context = useContext(CodingContext);
	if (context === undefined) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
