const jwt = require('jsonwebtoken');

/**
 * Sign a JWT token with the given payload.
 * @param {Object} payload - Data to encode in the token
 * @returns {string} Signed JWT token
 */
const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {JsonWebTokenError} If token is invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { signToken, verifyToken };
