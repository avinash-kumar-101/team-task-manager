const catchAsync = require('../utils/catchAsync');
const dashboardService = require('../services/dashboard.service');

/**
 * GET /api/v1/dashboard
 */
const getDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getDashboardData(req.user.id, req.user.role);
  res.status(200).json({ data });
});

module.exports = { getDashboard };
