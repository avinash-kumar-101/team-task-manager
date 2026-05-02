const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const loadProjectMember = require('../middleware/loadProjectMember');
const { requireRole } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema, updateStatusSchema } = require('../validators/task.schema');

// All task routes require authentication
router.use(auth);

// --- Project-scoped task routes ---

// GET /api/v1/projects/:id/tasks — list tasks for a project
router.get('/projects/:id/tasks', loadProjectMember, taskController.listTasks);

// POST /api/v1/projects/:id/tasks — create task
router.post('/projects/:id/tasks', loadProjectMember, validate(createTaskSchema), taskController.createTask);

// --- Task-specific routes ---

// GET /api/v1/tasks/:taskId — get single task
router.get('/tasks/:taskId', loadProjectMember, taskController.getTask);

// PUT /api/v1/tasks/:taskId — update task (admin or assignee)
router.put('/tasks/:taskId', loadProjectMember, validate(updateTaskSchema), taskController.updateTask);

// PATCH /api/v1/tasks/:taskId/status — update status only
router.patch('/tasks/:taskId/status', loadProjectMember, validate(updateStatusSchema), taskController.updateTaskStatus);

// DELETE /api/v1/tasks/:taskId — delete task (admin only)
router.delete('/tasks/:taskId', loadProjectMember, requireRole('admin'), taskController.deleteTask);

module.exports = router;
