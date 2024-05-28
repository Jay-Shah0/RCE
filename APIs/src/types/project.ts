import { Request } from "express";

export interface RequestWithProject extends Request {
	body: {
		user: User;
        repl: Repl
	};
}

interface User {
	id: string;
}

export interface Repl{
    ownerId: string
    replName: string
    replTemplete: string
}
