/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express's error handling middleware.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
