const AppError = require('../utils/AppError');
const prisma = require('../utils/prisma');

/**
 * Middleware to load and verify project membership.
 * Looks up the project_members table to check if req.user belongs to the project.
 * Attaches req.projectMember with the user's per-project role.
 * 
 * Supports both :id (project routes) and :projectId (nested routes) params.
 * For task routes with :taskId, resolves the project from the task.
 */
const loadProjectMember = async (req, res, next) => {
  try {
    let projectId = req.params.id || req.params.projectId;

    // If we have a taskId but no projectId, resolve it from the task
    if (!projectId && req.params.taskId) {
      const task = await prisma.task.findUnique({
        where: { id: req.params.taskId },
        select: { projectId: true },
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }
      projectId = task.projectId;
      req.taskProjectId = projectId;
    }

    if (!projectId) {
      throw new AppError('Project ID is required', 400);
    }

    // Check project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check membership
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: req.user.id,
        },
      },
    });

    if (!membership) {
      // Allow global admins to access any project
      if (req.user.role === 'admin') {
        req.projectMember = { role: 'admin', projectId };
        req.project = project;
        return next();
      }
      throw new AppError('Forbidden — you are not a member of this project', 403);
    }

    req.projectMember = membership;
    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = loadProjectMember;
