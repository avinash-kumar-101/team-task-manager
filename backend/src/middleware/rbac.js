const AppError = require('../utils/AppError');

/**
 * Role-Based Access Control middleware.
 * Checks if the user's project-level role matches one of the allowed roles.
 * Must be used AFTER loadProjectMember middleware.
 * 
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'member')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    // Check project-level role first (set by loadProjectMember)
    const memberRole = req.projectMember?.role;
    
    if (memberRole && roles.includes(memberRole)) {
      return next();
    }

    // Fallback to global user role
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }

    return next(new AppError('Forbidden — insufficient permissions', 403));
  };
};

/**
 * Checks if user has global admin role.
 * Use for operations not scoped to a specific project.
 */
const requireGlobalAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Forbidden — admin access required', 403));
  }
  next();
};

module.exports = { requireRole, requireGlobalAdmin };
