const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3, 'The username must be at least 3 characters long'),
  password: z.string().min(6, 'The password must be at least 6 characters long')
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

module.exports = { registerSchema, loginSchema };