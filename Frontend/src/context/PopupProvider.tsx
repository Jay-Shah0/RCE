import React, { useState } from "react";
import { PopupContext, PopupContextState } from "./PopupContext";

const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

	const contextValue: PopupContextState = {
		isPopupOpen,
		setIsPopupOpen,
	};

	return (
		<PopupContext.Provider value={contextValue}>
			{children}
		</PopupContext.Provider>
	);
};

export default PopupProvider;
