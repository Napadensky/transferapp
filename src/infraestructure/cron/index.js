const cron = require('node-cron');
const { AccountRepository } = require('../repositories/accountRepository');
const { BalanceRepository } = require('../repositories/balanceRopository');
const accountUseCases = require('../../application/accountUseCases');

cron.schedule('0 0 1 * *', () => {
  accountUseCases.applyMonthlyInterest(AccountRepository, BalanceRepository);
});
