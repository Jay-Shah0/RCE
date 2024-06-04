import React, { useState } from "react";
import { Repls, ReplsContext } from "./ReplsContext";

const ReplsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [repls, setRepls] = useState<Repls | null>(null);

	return (
		<ReplsContext.Provider value={{ repls, setRepls }}>
			{children}
		</ReplsContext.Provider>
	);
}

export default ReplsProvider;
