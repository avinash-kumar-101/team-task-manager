const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const loadProjectMember = require('../middleware/loadProjectMember');
const { requireRole, requireGlobalAdmin } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema, inviteMemberSchema } = require('../validators/project.schema');

// All project routes require authentication
router.use(auth);

// GET /api/v1/projects — list projects for current user
router.get('/', projectController.listProjects);

// POST /api/v1/projects — create project (admin only)
router.post('/', requireGlobalAdmin, validate(createProjectSchema), projectController.createProject);

// GET /api/v1/projects/:id — get project detail
router.get('/:id', loadProjectMember, projectController.getProject);

// PUT /api/v1/projects/:id — update project (admin only)
router.put('/:id', loadProjectMember, requireRole('admin'), validate(updateProjectSchema), projectController.updateProject);

// DELETE /api/v1/projects/:id — delete project (admin only)
router.delete('/:id', loadProjectMember, requireRole('admin'), projectController.deleteProject);

// GET /api/v1/projects/:id/members — list members
router.get('/:id/members', loadProjectMember, projectController.listMembers);

// POST /api/v1/projects/:id/members — invite member (admin only)
router.post('/:id/members', loadProjectMember, requireRole('admin'), validate(inviteMemberSchema), projectController.inviteMember);

// DELETE /api/v1/projects/:id/members/:uid — remove member (admin only)
router.delete('/:id/members/:uid', loadProjectMember, requireRole('admin'), projectController.removeMember);

module.exports = router;
