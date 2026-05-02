const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { signupSchema, loginSchema } = require('../validators/auth.schema');

// POST /api/v1/auth/signup
router.post('/signup', validate(signupSchema), authController.signup);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login);

// GET /api/v1/auth/me
router.get('/me', auth, authController.getMe);

module.exports = router;
