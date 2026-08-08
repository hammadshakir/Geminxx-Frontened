import { Router } from "express";
import * as devController from "../controller/dev.controller.js";

const devRouter = Router();

devRouter.get("/", (req, res) => {
  res.json({
    message: "🚀 Gemnixx API is running",
    version: "1.0.0",
    endpoints: {
      projects: {
        getAll: "GET /api/projects",
        create: "POST /api/new/project",
        getOne: "GET /api/projects/:id",
        update: "PUT /api/projects/:id",
        delete: "DELETE /api/projects/:id",
      },
      comments: {
        getAll: "GET /api/projects/:projectId/comments",
        create: "POST /api/projects/:projectId/comments",
        update: "PUT /api/comments/:id",
        delete: "DELETE /api/comments/:id",
        like: "POST /api/comments/:id/like",
        unlike: "POST /api/comments/:id/unlike",
      },
    },
  });
});

//GET all projects
devRouter.get("/projects", devController.ShowProjects);

//add new project
devRouter.post("/new/project", devController.AddProject);

// GET single project
devRouter.get("/projects/:id", devController.IndividualProject);

//edit project
devRouter.post("/project/:id/edit", devController.EditProject);

// UPDATE project
devRouter.put("/projects/:id", devController.UpdateProject);

// deleete project
devRouter.delete("/projects/:id", devController.DeleteProject);


export default devRouter;