import React from "react";

export interface User {
	accessToken: string;
	email: string;
	username: string;
}

export interface UserContextState {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = React.createContext<UserContextState>({
	user: null,
	setUser: () => {},
});
