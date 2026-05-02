const catchAsync = require('../utils/catchAsync');
const taskService = require('../services/task.service');

/**
 * POST /api/v1/projects/:id/tasks
 */
const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask({
    ...req.body,
    projectId: req.params.id,
    createdBy: req.user.id,
  });

  res.status(201).json({ data: task });
});

/**
 * GET /api/v1/projects/:id/tasks
 */
const listTasks = catchAsync(async (req, res) => {
  const filters = {
    status: req.query.status,
    priority: req.query.priority,
    assigneeId: req.query.assigneeId,
    search: req.query.search,
  };

  const tasks = await taskService.listTasks(req.params.id, filters);
  res.status(200).json({ data: tasks });
});

/**
 * GET /api/v1/tasks/:taskId
 */
const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTask(req.params.taskId);
  res.status(200).json({ data: task });
});

/**
 * PUT /api/v1/tasks/:taskId
 */
const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.taskId, req.body);
  res.status(200).json({ data: task });
});

/**
 * PATCH /api/v1/tasks/:taskId/status
 */
const updateTaskStatus = catchAsync(async (req, res) => {
  const task = await taskService.updateTaskStatus(req.params.taskId, req.body.status);
  res.status(200).json({ data: task });
});

/**
 * DELETE /api/v1/tasks/:taskId
 */
const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.taskId);
  res.status(204).send();
});

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
