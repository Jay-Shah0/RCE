import { createContext } from "react";

export interface PopupContextState {
	replPopup: boolean;
	setReplPopup: (replPopup: boolean) => void;
	gitPopup: boolean;
	setGitPopup: (gitPopup: boolean) => void;
}

export const PopupContext = createContext<PopupContextState>({
	replPopup: false,
	setReplPopup: () => {},
	gitPopup: false,
	setGitPopup: () => {},
});
