const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

/**
 * Create a new project. The creator is automatically added as an admin member.
 */
const createProject = async ({ name, description, ownerId }) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId,
      members: {
        create: {
          userId: ownerId,
          role: 'admin',
        },
      },
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { tasks: true, members: true },
      },
    },
  });

  return project;
};

/**
 * List all projects the user is a member of.
 * Admin users can see all projects.
 */
const listProjects = async (userId, userRole) => {
  const where = userRole === 'admin'
    ? {}
    : { members: { some: { userId } } };

  const projects = await prisma.project.findMany({
    where,
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { tasks: true, members: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return projects;
};

/**
 * Get a single project by ID with member count and task count.
 */
const getProject = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
      _count: {
        select: { tasks: true, members: true },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return project;
};

/**
 * Update project details (name, description).
 */
const updateProject = async (projectId, data) => {
  const project = await prisma.project.update({
    where: { id: projectId },
    data,
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { tasks: true, members: true },
      },
    },
  });

  return project;
};

/**
 * Delete a project (cascades to tasks and memberships via Prisma schema).
 */
const deleteProject = async (projectId) => {
  await prisma.project.delete({
    where: { id: projectId },
  });
};

/**
 * Invite a user to a project by email. Creates a ProjectMember record.
 */
const inviteMember = async (projectId, email, role = 'member') => {
  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('User not found — they must register first', 404);
  }

  // Check if already a member
  const existing = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    throw new AppError('User is already a member of this project', 409);
  }

  // Add member
  const member = await prisma.projectMember.create({
    data: {
      projectId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return member;
};

/**
 * Remove a member from a project.
 */
const removeMember = async (projectId, userId) => {
  // Check if member exists
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!member) {
    throw new AppError('Member not found in this project', 404);
  }

  await prisma.projectMember.delete({
    where: { id: member.id },
  });
};

/**
 * List all members of a project.
 */
const listMembers = async (projectId) => {
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return members;
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
  listMembers,
};
