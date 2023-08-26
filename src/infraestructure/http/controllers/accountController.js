const httpStatus = require('http-status');

const { responseSuccess, responseError } = require('../response');

const accountUseCases = require('../../../application/accountUseCases');

const { AccountRepository } = require('../../repositories/accountRepository');
const { BalanceRepository } = require('../../repositories/balanceRopository');

createAccount = async (req, res) => {
  try {
    const accountData = { ...req.body, userId: req.userId };
    const newAccount = await accountUseCases.createAccount(accountData, AccountRepository);
    responseSuccess(res, { accountId: newAccount.id }, httpStatus.CREATED);
  } catch (error) {
    responseError(res, error.message, [], httpStatus.BAD_REQUEST);
  }
};

const getAccounts = async (req, res) => {
  try {
    const accountData = { ...req.body, userId: req.userId };
    const accounts = await accountUseCases.getAccounts(accountData, AccountRepository);

    responseSuccess(res, { accounts }, httpStatus.OK);
  } catch (error) {
    responseError(res, error.message, [], httpStatus.BAD_REQUEST);
  }
}

const getAccountDetails = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { accountId } = req.params;

    const accountData = { userId: req.userId, accountId, role: req.role, page, size };

    const accounts = await accountUseCases.getBalance(accountData, BalanceRepository, AccountRepository);

    responseSuccess(res, { ...accounts }, httpStatus.OK);
  } catch (error) {
    responseError(res, error.message, [], httpStatus.BAD_REQUEST);
  }
}

const updateAccount = async (req, res) => {
  try {
    const accountData = { ...req.body, userId: req.userId };
    const accounts = await accountUseCases.getAccounts(accountData, AccountRepository);

    responseSuccess(res, { accounts }, httpStatus.OK);
  } catch (error) {
    responseError(res, error.message, [], httpStatus.BAD_REQUEST);
  }
}

const closeAccount = async (req, res) => {
  try {
    const accountData = { userId: req.userId, accountId: req.params.accountId };
    const accounts = await accountUseCases.closeAccount(accountData, AccountRepository);

    responseSuccess(res, { accounts }, httpStatus.OK);
  } catch (error) {
    responseError(res, error.message, [], httpStatus.BAD_REQUEST);
  }
}



module.exports = { createAccount, getAccounts, getAccountDetails, updateAccount, closeAccount };