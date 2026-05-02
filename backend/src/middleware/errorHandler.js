const AppError = require('../utils/AppError');

/**
 * Global error handling middleware.
 * Centralizes all error responses. Never exposes stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Prisma known error codes
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Invalid reference — related record not found';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', {
      statusCode,
      message,
      stack: err.stack,
      ...(err.code && { prismaCode: err.code }),
    });
  } else {
    // Only log non-operational errors in production
    if (!err.isOperational) {
      console.error('UNEXPECTED ERROR:', err);
    }
  }

  // Send response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
