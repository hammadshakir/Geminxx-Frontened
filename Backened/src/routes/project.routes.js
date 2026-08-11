// routes/project.routes.js
import { Router } from 'express';
import * as projectController from '../controller/project.controller.js';
import { auth } from '../middleware/auth.js';
import { 
  canView, 
  canCreateProject, 
  canEditProject, 
  canDeleteProject
} from '../middleware/rbac.js';

const projectRouter = Router();

// All routes require authentication
projectRouter.use(auth);

// ===== VIEW ROUTES - Everyone (including viewer) =====
projectRouter.get('/', canView, projectController.getAllProjects);
projectRouter.get('/:id', canView, projectController.getProject);

// ===== CREATE ROUTE - Admin, Client, Team Member =====
projectRouter.post('/', canCreateProject, projectController.createProject);

// ===== EDIT ROUTE - Only Admin and Client =====
projectRouter.put('/:id', canEditProject, projectController.updateProject);

// ===== DELETE ROUTE - Only Admin =====
projectRouter.delete('/:id', canDeleteProject, projectController.deleteProject);

export default projectRouter;