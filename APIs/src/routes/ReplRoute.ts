import { Router } from "express";
import { createProject } from "../services/projectServices";

const replRouter = Router();

// Route to handle project creation
replRouter.post("/create", createProject);

export default replRouter;
    