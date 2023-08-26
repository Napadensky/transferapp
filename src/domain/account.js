const { z } = require('zod');

const createAccountSchema = z.object({
  accountType: z.enum(['Savings', 'Current', 'BasicSavings'])
}).strict();

module.exports = { createAccountSchema };
