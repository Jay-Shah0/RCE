import { Request, Response, NextFunction } from "express";
import { Repl, RequestWithProject } from "../types/project";
import axios from "axios";

const PROJECT_SERVICE_URL = "http://localhost:8081/create";

export const createProject = async (
	req: RequestWithProject,
	res: Response,
	next: NextFunction
) => {
	try {
		// Assume auth middleware has added the user object to req
		const { user, repl } = req.body;

		// Create the payload to be sent to the project service
		const modifiedRepl: Repl = {
			...repl,
			ownerId: user.id,	
		};

		// Modify the request body
		req.body = { user, repl: modifiedRepl };

		console.log(req.body)

		const microserviceRequestBody = req.body

		 const response = await axios.post(
				PROJECT_SERVICE_URL,
				microserviceRequestBody
			);
			res.status(response.status).send(response.data);
	} catch (error) {
		console.log(error);
		next(error);
	}
};
