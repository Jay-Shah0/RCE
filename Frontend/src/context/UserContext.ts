import React from "react";

export interface User {
	accessToken: string;
	email: string;
	username: string;
}

export interface UserContextState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const UserContext = React.createContext<UserContextState>({
	user: null,
	setUser: () => {},
});
