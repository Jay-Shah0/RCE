import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import authenticateJWT from "./middlewares/authorization";
import replRouter from "./routes/ReplRoute";
import userRouter from "./routes/UserRoute";

// Load environment variables from .env file
dotenv.config();

const app = express();	
const port = process.env.PORT || 8080;

// Configure CORS to allow requests from the frontend running on port 5173
const corsOptions = {
	origin: "http://localhost:5173", // Replace with your frontend URL
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true, // Allow cookies to be sent with the requests
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(authenticateJWT);

app.use("/api/repl",replRouter)
app.use("api/user",userRouter)

app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("Hello, TypeScript!");
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
