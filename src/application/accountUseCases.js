const accountUseCases = {};
accountUseCases.createAccount = async (accountData, AccountRepository) => {
  const checkAccount = await AccountRepository.findByTypeAccount(accountData);

  if (checkAccount && checkAccount.status == "OPEN") throw new Error('AccountType already exists')
  if (checkAccount?.status == "CLOSED") {
    const oldAccount = await AccountRepository.updateAccountStatus(checkAccount.id, "OPEN")
    return oldAccount
  }

  const newAccount = await AccountRepository.create(accountData);
  return newAccount;
};

accountUseCases.getAccounts = async (accountData, AccountRepository) => {
  return await AccountRepository.findByUserId(accountData.userId);
};

accountUseCases.getBalance = async (accountData, BalanceRepository, AccountRepository) => {
  const { userId, accountId, role } = accountData

  const isAdmin = role == "ADMIN";
  const isOwner = await AccountRepository.isOwner({ fromAccountId: accountId, userId });

  const account = await AccountRepository.findByTypeAccountId(accountId);

  if (!isAdmin && !isOwner) { throw new Error('Account not found') }

  const balance = await BalanceRepository.findByAccountId({ accountId });

  if (!balance) { throw new Error('Balance not found') }

  return { account: account?.toJSON(), balance: balance };
};

accountUseCases.closeAccount = async (accountData, AccountRepository) => {
  const accounts = await AccountRepository.closeAccount(accountData.userId, accountData.accountId);
  if (accounts[0] == 0) { throw new Error('Account not found') }
  return accounts
};


accountUseCases.makeTransaction = async (transferData, AccountRepository, BalanceRepository) => {

  const { fromAccountId, toAccountId, amount } = transferData;

  const fromAccountData = await AccountRepository.findByTypeAccountId(fromAccountId);
  const toAccountData = await AccountRepository.findByTypeAccountId(toAccountId);

  if (!fromAccountData || !toAccountData) throw new Error('Once Account not found')

  const fromBalanceData = { accountId: fromAccountId, beforeBalance: fromAccountData.balance, afterBalance: fromAccountData.balance - amount, amount: (-amount), lastUpdate: new Date() }
  const toBalanceData = { accountId: toAccountId, beforeBalance: toAccountData.balance, afterBalance: toAccountData.balance + amount, amount, lastUpdate: new Date() }

  if (fromAccountId == toAccountId) { throw new Error('Accounts must be different') }
  if (fromAccountData.balance < amount) { throw new Error('Insufficient funds') }
  if (toAccountData.accountType == 'BasicSavings' && toAccountData.amount + amount > 50000) {
    throw new Error('BasicSavings not allowed to have more than 50,000')
  }

  const newFromAccountBalance = fromAccountData.balance - amount;
  const newToAccountBalance = toAccountData.balance + amount;
  const fromAccountUpdate = await AccountRepository.updateAccountBalance(fromAccountId, newFromAccountBalance);
  const toAccountUpdate = await AccountRepository.updateAccountBalance(toAccountId, newToAccountBalance);

  await BalanceRepository.create(fromBalanceData);
  await BalanceRepository.create(toBalanceData);

  if (fromAccountUpdate[0] == 0 || toAccountUpdate[0] == 0) { throw new Error('Account not found') }
  return { newSrcBalance: newFromAccountBalance, totalDestBalance: newToAccountBalance, transferredAt: new Date() }
};

accountUseCases.isOwner = async (accountData, AccountRepository) => {
  const { fromAccountId, userId } = accountData;

  const isOwnerAccount = await AccountRepository.isOwner({ fromAccountId: Number(fromAccountId), userId })
  return isOwnerAccount
}

accountUseCases.calculateMonthlyInterest = (principal, annualRate = 0.05) => {
  const n = 12;
  const t = 1 / 12;
  const amount = principal * Math.pow((1 + annualRate / n), n * t);
  const interest = amount - principal;
  return interest;
}

accountUseCases.applyMonthlyInterest = async (AccountRepository, BalanceRepository) => {
  const basicSavingsAccounts = await AccountRepository.findAllByType('BasicSavings');
  const basicSavingsAccountsList = basicSavingsAccounts.map(account => account.toJSON())

  for (const account of basicSavingsAccountsList) {
    const interest = accountUseCases.calculateMonthlyInterest(account.balance);
    account.balance += interest;
    if (account.balance > 50000) account.balance = 50000;
    await AccountRepository.update(account.id, { balance: account.balance.toFixed(2) });
    await BalanceRepository.create({ accountId: account.id, beforeBalance: account.balance, afterBalance: account.balance, amount: interest, lastUpdate: new Date() })
  }
}

module.exports = accountUseCases;