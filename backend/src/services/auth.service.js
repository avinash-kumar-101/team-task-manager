const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

/**
 * Register a new user.
 * Hashes password, creates user record, and returns user data with JWT.
 */
const signup = async ({ name, email, password, role }) => {
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email already exists', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || 'member', // Use provided role or default to member
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Sign JWT
  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return { user, token };
};

/**
 * Authenticate user with email and password.
 * Returns user data with JWT on success.
 */
const login = async ({ email, password }) => {
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Compare password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Sign JWT
  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Get current user profile from the authenticated user data.
 */
const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

module.exports = { signup, login, getMe };
