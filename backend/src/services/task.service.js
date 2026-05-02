const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

/**
 * Create a new task within a project.
 */
const createTask = async ({ projectId, title, description, status, priority, dueDate, assigneeId, createdBy }) => {
  // If assignee is specified, verify they are a project member
  if (assigneeId) {
    const isMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: assigneeId,
        },
      },
    });

    if (!isMember) {
      throw new AppError('Assignee must be a member of this project', 400);
    }
  }

  const task = await prisma.task.create({
    data: {
      projectId,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId,
      createdBy,
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return task;
};

/**
 * List all tasks for a project with optional filters.
 */
const listTasks = async (projectId, filters = {}) => {
  const where = { projectId };

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.priority) {
    where.priority = filters.priority;
  }
  if (filters.assigneeId) {
    where.assigneeId = filters.assigneeId;
  }
  if (filters.search) {
    where.title = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  // Add overdue flag
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return tasks.map((task) => ({
    ...task,
    isOverdue: task.dueDate && new Date(task.dueDate) < now && task.status !== 'done',
  }));
};

/**
 * Get a single task by ID.
 */
const getTask = async (taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Add overdue flag
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  task.isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'done';

  return task;
};

/**
 * Update task fields.
 */
const updateTask = async (taskId, data) => {
  // If updating assignee, we need to check they're a member
  if (data.assigneeId) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError('Task not found', 404);

    const isMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: task.projectId,
          userId: data.assigneeId,
        },
      },
    });

    if (!isMember) {
      throw new AppError('Assignee must be a member of this project', 400);
    }
  }

  // Process dueDate
  if (data.dueDate !== undefined) {
    data.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return task;
};

/**
 * Update only the status of a task.
 */
const updateTaskStatus = async (taskId, status) => {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return task;
};

/**
 * Delete a task.
 */
const deleteTask = async (taskId) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await prisma.task.delete({ where: { id: taskId } });
};

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
