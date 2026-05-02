const { z } = require('zod');

const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(150, 'Project name must be at most 150 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional()
    .nullable(),
});

const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(150, 'Project name must be at most 150 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional()
    .nullable(),
});

const inviteMemberSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  role: z
    .enum(['admin', 'member'], {
      errorMap: () => ({ message: 'Role must be admin or member' }),
    })
    .optional()
    .default('member'),
});

module.exports = { createProjectSchema, updateProjectSchema, inviteMemberSchema };
