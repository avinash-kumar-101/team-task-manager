const prisma = require('../utils/prisma');

/**
 * Get aggregated dashboard data for the current user.
 * Returns summary cards, task breakdown, overdue tasks, user's tasks, and recent activity.
 */
const getDashboardData = async (userId, userRole) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Get user's project IDs
  let projectIds;
  if (userRole === 'admin') {
    const projects = await prisma.project.findMany({ select: { id: true } });
    projectIds = projects.map((p) => p.id);
  } else {
    const memberships = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });
    projectIds = memberships.map((m) => m.projectId);
  }

  // Total projects
  const totalProjects = projectIds.length;

  // Task counts by status
  const tasksByStatus = await prisma.task.groupBy({
    by: ['status'],
    where: { projectId: { in: projectIds } },
    _count: { id: true },
  });

  const statusBreakdown = {
    todo: 0,
    in_progress: 0,
    done: 0,
  };
  tasksByStatus.forEach((item) => {
    statusBreakdown[item.status] = item._count.id;
  });

  const totalTasks = Object.values(statusBreakdown).reduce((a, b) => a + b, 0);

  // Overdue tasks
  const overdueTasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      dueDate: { lt: now },
      status: { not: 'done' },
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: { dueDate: 'asc' },
    take: 10,
  });

  // My tasks (assigned to current user)
  const myTasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
      status: { not: 'done' },
    },
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
    take: 10,
  });

  // Recent activity (last 10 updated tasks)
  const recentActivity = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
    },
    include: {
      assignee: {
        select: { id: true, name: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  // Tasks due today
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tasksDueToday = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      dueDate: {
        gte: now,
        lt: tomorrow,
      },
      status: { not: 'done' },
    },
  });

  return {
    totalProjects,
    totalTasks,
    tasksDueToday,
    tasksByStatus: statusBreakdown,
    overdueTasks: overdueTasks.map((t) => ({
      ...t,
      isOverdue: true,
    })),
    myTasks: myTasks.map((t) => ({
      ...t,
      isOverdue: t.dueDate && new Date(t.dueDate) < now,
    })),
    recentActivity,
  };
};

module.exports = { getDashboardData };
