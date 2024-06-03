import React, { useState } from "react";
import { PopupContext, PopupContextState } from "./PopupContext";

const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [replPopup, setReplPopup] = useState<boolean>(false);
	const [gitPopup, setGitPopup] = useState<boolean>(false);

	const contextValue: PopupContextState = {
		replPopup,
		setReplPopup,
		gitPopup,
		setGitPopup,
	};

	return (
		<PopupContext.Provider value={contextValue}>
			{children}
		</PopupContext.Provider>
	);
};

export default PopupProvider;
