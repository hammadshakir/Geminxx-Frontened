// controller/task.controller.js
import Task from '../models/task.js';
import User from '../models/user.js';
import Notification from '../models/notification.js';
import Conversation from '../models/conversation.js';
import AppError from '../utils/Error.js';

// ===== CREATE TASK =====
export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    
    if (!['admin', 'client'].includes(req.user.role)) {
      return next(new AppError('Only clients and admin can create tasks', 403));
    }

    const task = new Task({
      title,
      description,
      project: projectId || null,
      createdBy: req.user._id,
      client: req.user.role === 'client' ? req.user._id : null,
      assignedTo: assignedTo || [],
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: 'pending'
    });

    await task.save();

    // Notify assigned team members
    if (assignedTo && assignedTo.length > 0) {
      for (const userId of assignedTo) {
        const notification = new Notification({
          recipient: userId,
          sender: req.user._id,
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: `You have been assigned to: ${title}`,
          entityId: task._id,
          entityType: 'task',
          link: `/tasks/${task._id}`
        });
        await notification.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// ===== GET TASKS =====
export const getTasks = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'client') {
      query = { client: req.user._id };
    } else if (req.user.role === 'team_member') {
      query = { assignedTo: req.user._id };
    } else {
      return next(new AppError('You do not have permission to view tasks', 403));
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// ===== GET SINGLE TASK =====
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Check access
    if (req.user.role !== 'admin') {
      if (req.user.role === 'client' && task.client?.toString() !== req.user._id.toString()) {
        return next(new AppError('You do not have access to this task', 403));
      }
      if (req.user.role === 'team_member' && !task.assignedTo.some(id => id.toString() === req.user._id.toString())) {
        return next(new AppError('You do not have access to this task', 403));
      }
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

// ===== UPDATE TASK =====
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    const canEdit = task.canEdit(req.user._id, req.user.role);
    if (!canEdit) {
      return next(new AppError('You do not have permission to edit this task', 403));
    }

    const updates = req.body;
    const oldValues = {};
    const newValues = {};

    for (const [key, value] of Object.entries(updates)) {
      if (task[key] !== undefined && task[key] !== value) {
        oldValues[key] = task[key];
        newValues[key] = value;
        task.addHistory(key, task[key], value, req.user._id);
        task[key] = value;
      }
    }

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// ===== DELETE TASK (Admin Only) =====
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};