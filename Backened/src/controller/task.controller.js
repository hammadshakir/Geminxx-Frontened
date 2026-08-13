// controller/task.controller.js
import Task from '../models/task.js';
import User from '../models/user.js';
import AppError from '../utils/Error.js';

// ============================================
// GET ALL TASKS
// ============================================
export const getTasks = async (req, res, next) => {
  try {
    console.log('📋 Fetching tasks for user:', req.user.email, 'Role:', req.user.role);
    
    let query = {};

    // Admin can see all tasks
    if (req.user.role === 'admin') {
      query = {};
    } 
    // Client can see their own tasks
    else if (req.user.role === 'client') {
      query = { client: req.user._id };
    } 
    // Team member can see tasks assigned to them
    else if (req.user.role === 'team_member') {
      query = { assignedTo: req.user._id };
    } 
    // Viewer can see all tasks but read-only
    else if (req.user.role === 'viewer') {
      query = {};
    }

    console.log('🔍 Query:', JSON.stringify(query));

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${tasks.length} tasks`);

    res.json({
      success: true,
      count: tasks.length,
      tasks,
      permissions: {
        canCreate: ['admin', 'client'].includes(req.user.role),
        canEdit: ['admin', 'client'].includes(req.user.role),
        canDelete: req.user.role === 'admin',
        canComplete: ['admin', 'team_member'].includes(req.user.role),
      }
    });
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    next(error);
  }
};

// ============================================
// GET SINGLE TASK
// ============================================
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CREATE TASK
// ============================================
export const createTask = async (req, res, next) => {
  try {
    console.log('📝 Creating task for user:', req.user.email);
    console.log('📝 Task data:', req.body);

    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !description) {
      return next(new AppError('Title and description are required', 400));
    }

    // Ensure assignedTo is an array
    let assignedToArray = [];
    if (assignedTo) {
      if (Array.isArray(assignedTo)) {
        assignedToArray = assignedTo;
      } else {
        assignedToArray = [assignedTo];
      }
    }

    const task = new Task({
      title,
      description,
      project: projectId || null,
      createdBy: req.user._id,
      client: req.user.role === 'client' ? req.user._id : null,
      assignedTo: assignedToArray,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: 'pending'
    });

    await task.save();
    console.log('✅ Task created:', task._id);

    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('❌ Error creating task:', error);
    next(error);
  }
};

// ============================================
// UPDATE TASK
// ============================================
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Permission checks
    if (req.user.role === 'admin') {
      // Admin can update everything
    } else if (req.user.role === 'client' && task.client?.toString() === req.user._id.toString()) {
      // Client can update their own tasks
    } else if (req.user.role === 'team_member' && task.assignedTo.some(id => id.toString() === req.user._id.toString())) {
      // Team member can only update status
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return next(new AppError('Team members can only update task status', 403));
      }
    } else {
      return next(new AppError('You do not have permission to update this task', 403));
    }

    // Apply updates
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'createdBy' && key !== 'client') {
        task[key] = updates[key];
      }
    });

    await task.save();
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE TASK
// ============================================
export const deleteTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admin can delete tasks', 403));
    }

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

// ============================================
// GET MY TASKS
// ============================================
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET MY CREATED TASKS
// ============================================
export const getMyCreatedTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
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

// ============================================
// GET TASKS BY STATUS
// ============================================
export const getTasksByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    
    const validStatus = ['pending', 'in_progress', 'review', 'completed', 'rejected'];
    if (!validStatus.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    let query = { status };
    
    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'team_member') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET OVERDUE TASKS
// ============================================
export const getOverdueTasks = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query = {
      dueDate: { $lt: today },
      status: { $ne: 'completed' }
    };

    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'team_member') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TASK STATISTICS
// ============================================
export const getTaskStats = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'team_member') {
      query.assignedTo = req.user._id;
    }

    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: 'completed' });
    const pending = await Task.countDocuments({ ...query, status: 'pending' });
    const inProgress = await Task.countDocuments({ ...query, status: 'in_progress' });
    const review = await Task.countDocuments({ ...query, status: 'review' });
    const rejected = await Task.countDocuments({ ...query, status: 'rejected' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = await Task.countDocuments({
      ...query,
      dueDate: { $lt: today },
      status: { $ne: 'completed' }
    });

    res.json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        inProgress,
        review,
        rejected,
        overdue
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// BULK UPDATE TASK STATUS
// ============================================
export const bulkUpdateTaskStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admin can bulk update tasks', 403));
    }

    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return next(new AppError('Task IDs array is required', 400));
    }

    const validStatus = ['pending', 'in_progress', 'review', 'completed', 'rejected'];
    if (!validStatus.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds } },
      { status }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} tasks updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ASSIGN TASK TO USER
// ============================================
export const assignTaskToUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admin can assign tasks', 403));
    }

    const { taskId, userId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (!task.assignedTo.includes(userId)) {
      task.assignedTo.push(userId);
      await task.save();
    }

    await task.populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UNASSIGN TASK FROM USER
// ============================================
export const unassignTaskFromUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admin can unassign tasks', 403));
    }

    const { taskId, userId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId);
    await task.save();

    await task.populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Task unassigned successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};