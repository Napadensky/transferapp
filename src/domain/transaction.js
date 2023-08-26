const { z } = require('zod');

const transferSchema = z.object({
  fromAccountId: z.string(),
  toAccountId: z.string(),
  amount: z.number().positive(),
});

module.exports = { transferSchema };