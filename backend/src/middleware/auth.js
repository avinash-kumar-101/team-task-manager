const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

/**
 * JWT Authentication middleware.
 * Verifies the Bearer token from Authorization header,
 * fetches the user from DB, and attaches to req.user.
 */
const auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized — no token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('Unauthorized — user no longer exists', 401);
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Unauthorized — invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Unauthorized — token expired', 401));
    }
    next(error);
  }
};

module.exports = auth;
