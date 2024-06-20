import { Router } from "express";
import { createProject, deleteProject } from "../services/projectServices";

const replRouter = Router();

// Route to handle project creation
replRouter.post("/create", createProject);
replRouter.post("/delete", deleteProject)

export default replRouter;
    