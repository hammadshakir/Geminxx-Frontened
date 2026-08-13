// routes/task.routes.js
import { Router } from 'express';
import * as taskController from '../controller/task.controller.js';
import { auth } from '../middleware/auth.js';
import { isAdmin, isClient, canView } from '../middleware/rbac.js';

const taskRouter = Router();

// ✅ All task routes require authentication
taskRouter.use(auth);

// ============================================
// GET ROUTES
// ============================================
// Get all tasks (role-based)
taskRouter.get('/', canView, taskController.getTasks);

// Get my assigned tasks
taskRouter.get('/my-tasks', taskController.getMyTasks);

// Get my created tasks
taskRouter.get('/my-created', taskController.getMyCreatedTasks);

// Get tasks by status
taskRouter.get('/status/:status', taskController.getTasksByStatus);

// Get overdue tasks
taskRouter.get('/overdue', taskController.getOverdueTasks);

// Get task statistics
taskRouter.get('/stats', taskController.getTaskStats);

// Get single task
taskRouter.get('/:id', canView, taskController.getTask);

// ============================================
// POST ROUTES
// ============================================
// Create task (Admin & Client)
taskRouter.post('/', isClient, taskController.createTask);

// Bulk update status (Admin only)
taskRouter.post('/bulk-update', isAdmin, taskController.bulkUpdateTaskStatus);

// ============================================
// PUT ROUTES
// ============================================
// Update task
taskRouter.put('/:id', taskController.updateTask);

// Assign task to user (Admin only)
taskRouter.put('/:taskId/assign/:userId', isAdmin, taskController.assignTaskToUser);

// Unassign task from user (Admin only)
taskRouter.put('/:taskId/unassign/:userId', isAdmin, taskController.unassignTaskFromUser);

// ============================================
// DELETE ROUTES
// ============================================
// Delete task (Admin only)
taskRouter.delete('/:id', isAdmin, taskController.deleteTask);

export default taskRouter;