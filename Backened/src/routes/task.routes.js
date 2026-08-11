// routes/task.routes.js
import { Router } from 'express';
import * as taskController from '../controller/task.controller.js';
import { auth } from '../middleware/auth.js';
import { isClient, isAdmin, canView } from '../middleware/rbac.js';

const taskRouter = Router();

taskRouter.use(auth); // All task routes require auth

taskRouter.post('/', isClient, taskController.createTask);
taskRouter.get('/', canView, taskController.getTasks);
taskRouter.get('/:id', canView, taskController.getTask);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', isAdmin, taskController.deleteTask);

export default taskRouter;