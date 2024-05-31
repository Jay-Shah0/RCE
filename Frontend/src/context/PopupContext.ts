import { createContext } from "react";

export interface PopupContextState {
	isPopupOpen: boolean;
	setIsPopupOpen: (isOpen: boolean) => void;
}

export const PopupContext = createContext<PopupContextState>({
	isPopupOpen: false,
	setIsPopupOpen: () => {},
});
