import { Router } from "express";
import { closeRepl, createRepl, deleteRepl, openRepl } from "../services/replServices";

const replRouter = Router();

// Route to handle project creation
replRouter.post("/create", createRepl);
replRouter.post("/delete", deleteRepl);
replRouter.post("/open", openRepl);
replRouter.post("/close", closeRepl);

export default replRouter;
    