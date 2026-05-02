const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

/**
 * POST /api/v1/auth/signup
 */
const signup = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await authService.signup({ name, email, password, role });

  res.status(201).json({
    data: result,
  });
});

/**
 * POST /api/v1/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.status(200).json({
    data: result,
  });
});

/**
 * GET /api/v1/auth/me
 */
const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json({
    data: { user },
  });
});

module.exports = { signup, login, getMe };
