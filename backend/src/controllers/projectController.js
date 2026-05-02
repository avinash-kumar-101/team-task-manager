const catchAsync = require('../utils/catchAsync');
const projectService = require('../services/project.service');

/**
 * POST /api/v1/projects
 */
const createProject = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const project = await projectService.createProject({
    name,
    description,
    ownerId: req.user.id,
  });

  res.status(201).json({ data: project });
});

/**
 * GET /api/v1/projects
 */
const listProjects = catchAsync(async (req, res) => {
  const projects = await projectService.listProjects(req.user.id, req.user.role);
  res.status(200).json({ data: projects });
});

/**
 * GET /api/v1/projects/:id
 */
const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProject(req.params.id);
  res.status(200).json({ data: project });
});

/**
 * PUT /api/v1/projects/:id
 */
const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.status(200).json({ data: project });
});

/**
 * DELETE /api/v1/projects/:id
 */
const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.status(204).send();
});

/**
 * POST /api/v1/projects/:id/members
 */
const inviteMember = catchAsync(async (req, res) => {
  const { email, role } = req.body;
  const member = await projectService.inviteMember(req.params.id, email, role);
  res.status(201).json({ data: member });
});

/**
 * DELETE /api/v1/projects/:id/members/:uid
 */
const removeMember = catchAsync(async (req, res) => {
  await projectService.removeMember(req.params.id, req.params.uid);
  res.status(204).send();
});

/**
 * GET /api/v1/projects/:id/members
 */
const listMembers = catchAsync(async (req, res) => {
  const members = await projectService.listMembers(req.params.id);
  res.status(200).json({ data: members });
});

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
