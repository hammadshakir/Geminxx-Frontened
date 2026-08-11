// middleware/rbac.js
import AppError from '../utils/Error.js';

export const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError(
        `Insufficient permissions. Required: ${roles.join(', ')}. Current: ${req.user.role}`,
        403
      ));
    }
    
    next();
  };
};

export const isAdmin = hasRole(['admin']);
export const isClient = hasRole(['admin', 'client']);
export const isTeamMember = hasRole(['admin', 'client', 'team_member']);

export const canView = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  
  if (req.user.status === 'suspended') {
    return next(new AppError('Account suspended', 403));
  }
  
  next();
};

export const canCreateProject = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  
  if (req.user.role === 'viewer') {
    return next(new AppError('Viewers cannot create projects', 403));
  }
  
  next();
};

export const canEditProject = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  
  if (!['admin', 'client'].includes(req.user.role)) {
    return next(new AppError('Only admin and client can edit projects', 403));
  }
  
  next();
};

export const canDeleteProject = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Only admin can delete projects', 403));
  }
  
  next();
};