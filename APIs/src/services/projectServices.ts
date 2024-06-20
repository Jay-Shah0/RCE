import { Response, NextFunction } from "express";
import { Repl, RequestWithProject } from "../types/project";
import axios from "axios";

const PROJECT_SERVICE_URL = (route : string) => `http://localhost:8081/${route}`;

export const createProject = async (
	req: RequestWithProject,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user, repl } = req.body;

		const modifiedRepl: Repl = {
			...repl,
			ownersqlId: user.sqlId,
			ownermongoId: user.mongoId,
		};

		console.log(modifiedRepl);

		const RequestBody = modifiedRepl;
		const RequestURL = PROJECT_SERVICE_URL("create");

		const response = await axios.post(RequestURL, RequestBody);

		res.status(response.status).send(response.data);

	} catch (error) {
		next(error);
	}
};


export const deleteProject = async (
	req: RequestWithProject,
	res: Response,
	next: NextFunction
) => {
	const { user, repl } = req.body;

	const modifiedRepl: Repl = {
		...repl,
		ownersqlId: user.sqlId,
		ownermongoId: user.mongoId,
	};

	console.log(modifiedRepl);

	const RequestBody = modifiedRepl;
	const RequestURL = PROJECT_SERVICE_URL("delete	");

	const response = await axios.post(RequestURL, RequestBody);

	res.status(response.status).send(response.data);
}
