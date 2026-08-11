// controller/project.controller.js
import Project from '../models/project.js';
import AppError from '../utils/Error.js';

// ===== GET ALL PROJECTS =====
export const getAllProjects = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'admin') {
      query = {};
    } else if (req.user.role === 'client') {
      query = { client: req.user._id };
    } else if (req.user.role === 'team_member') {
      query = { assignedTo: req.user._id };
    } else if (req.user.role === 'viewer') {
      query = {};
    }
    
    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: projects.length,
      projects,
      permissions: {
        canCreate: ['admin', 'client', 'team_member'].includes(req.user.role),
        canEdit: ['admin', 'client'].includes(req.user.role),
        canDelete: req.user.role === 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== GET SINGLE PROJECT =====
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    // Check access
    if (req.user.role === 'client' && project.client?.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have access to this project', 403));
    }
    
    if (req.user.role === 'team_member' && !project.assignedTo.some(id => id.toString() === req.user._id.toString())) {
      return next(new AppError('You do not have access to this project', 403));
    }
    
    res.json({
      success: true,
      project,
      permissions: {
        canEdit: ['admin', 'client'].includes(req.user.role),
        canDelete: req.user.role === 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== CREATE PROJECT - Admin, Client, Team Member =====
export const createProject = async (req, res, next) => {
  try {
    // 🔒 Viewer cannot create
    if (req.user.role === 'viewer') {
      return next(new AppError('Viewers cannot create projects', 403));
    }
    
    const { title, description, startingDate, DeadLine, progress, priority, category } = req.body;
    
    if (!title || !description) {
      return next(new AppError('Title and description are required', 400));
    }
    
    const project = new Project({
      title,
      description,
      startingDate: startingDate || null,
      DeadLine: DeadLine || null,
      progress: progress || 0,
      priority: priority || 'medium',
      category: category || 'other',
      createdBy: req.user._id,
      client: req.user.role === 'client' ? req.user._id : null,
      assignedTo: req.body.assignedTo || [],
      status: progress === 100 ? 'completed' : 'active'
    });
    
    await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

// ===== UPDATE PROJECT - Only Admin and Client =====
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    // 🔒 Viewer and Team Member cannot edit
    if (req.user.role === 'viewer') {
      return next(new AppError('Viewers cannot edit projects', 403));
    }
    
    if (req.user.role === 'team_member') {
      return next(new AppError('Team members cannot edit projects', 403));
    }
    
    // 🔒 Client can only edit their own projects
    if (req.user.role === 'client' && project.client?.toString() !== req.user._id.toString()) {
      return next(new AppError('You can only edit your own projects', 403));
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        project[key] = updates[key];
      }
    });
    
    if (project.progress === 100) {
      project.status = 'completed';
    } else if (project.progress > 0) {
      project.status = 'active';
    } else {
      project.status = 'pending';
    }
    
    await project.save();
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

// ===== DELETE PROJECT - Only Admin =====
export const deleteProject = async (req, res, next) => {
  try {
    // 🔒 Only admin can delete
    if (req.user.role !== 'admin') {
      return next(new AppError('Only admin can delete projects', 403));
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    
    await project.deleteOne();
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};