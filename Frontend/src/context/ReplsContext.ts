import React from "react";

interface Repl {
	id: string;
	isPublic: boolean;
	mongoReplId: string;
	ownermongoId: string;
	ownersqlId: string;
	name: string;
	template: string;
	updatedAt: string
}

export interface Repls extends Array<Repl> {}

export interface ReplsContextState {
	repls: Repls | null;
	setRepls: (repls: Repls | null) => void;
}

export const ReplsContext = React.createContext<ReplsContextState>({
	repls: null,
	setRepls: () => {},
});
