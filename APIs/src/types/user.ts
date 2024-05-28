import { Request } from "express";

export interface RequestWithUser extends Request {
	body: {
		user?: User; 
	};
}

interface User {
	id: string;
}
