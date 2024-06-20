import { Request } from "express";

export interface RequestWithProject extends Request {
	body: {
		user: User;
        repl: Repl
	};
}

interface User {
	sqlId: string;
    mongoId: string;
}

export interface Repl{
    id: string
    mongoReplId: string
    ownersqlId: string
    ownermongoId: string
    replName: string
    replTemplete: string
}
