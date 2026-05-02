const AppError = require('../utils/AppError');

/**
 * Validation middleware factory using Zod schemas.
 * Validates request body against the provided schema.
 * Returns 422 with error details on validation failure.
 * 
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(422).json({
        error: 'Validation failed',
        errors,
      });
    }

    // Replace request data with parsed (and transformed) data
    req[source] = result.data;
    next();
  };
};

module.exports = validate;
