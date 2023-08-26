const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

module.exports = { registerSchema, loginSchema };