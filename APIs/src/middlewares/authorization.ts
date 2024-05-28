import { RequestWithUser } from './../types/user';
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { ApiError } from "./errorHandler";

const authenticateJWT = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return next(new ApiError(401, "Access denied. No token provided."));
	}

	const headers = { Authorization: `Bearer ${token}` };

	try {
		const response = await axios.get("http://localhost:3000/authorization", {
			headers,
		});

		const { userId } = response.data;

		req.body.user = { id: userId };
		next();
	} catch (err) {
		console.log(err);
		next(new ApiError(403, "Invalid token."));
	}
};

export default authenticateJWT;
