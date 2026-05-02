const { z } = require('zod');

const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(200, 'Task title must be at most 200 characters')
    .trim(),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .trim()
    .optional()
    .nullable(),
  status: z
    .enum(['todo', 'in_progress', 'done'], {
      errorMap: () => ({ message: 'Invalid status value — must be todo, in_progress, or done' }),
    })
    .optional()
    .default('todo'),
  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Invalid priority value — must be low, medium, or high' }),
    })
    .optional()
    .default('medium'),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
  assigneeId: z
    .string()
    .uuid('Invalid assignee ID')
    .optional()
    .nullable(),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(200, 'Task title must be at most 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(5000)
    .trim()
    .optional()
    .nullable(),
  status: z
    .enum(['todo', 'in_progress', 'done'], {
      errorMap: () => ({ message: 'Invalid status value' }),
    })
    .optional(),
  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Invalid priority value' }),
    })
    .optional(),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .nullable(),
  assigneeId: z
    .string()
    .uuid('Invalid assignee ID')
    .optional()
    .nullable(),
});

const updateStatusSchema = z.object({
  status: z
    .enum(['todo', 'in_progress', 'done'], {
      errorMap: () => ({ message: 'Invalid status value — must be todo, in_progress, or done' }),
    }),
});

module.exports = { createTaskSchema, updateTaskSchema, updateStatusSchema };
