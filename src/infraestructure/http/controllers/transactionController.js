const httpStatus = require('http-status');

const { responseSuccess, responseError } = require('../response');

const accountUseCases = require('../../../application/accountUseCases');
const transactionUseCases = require('../../../application/transactionUseCases');

const { AccountRepository } = require('../../repositories/accountRepository');
const { TransactionRepository } = require('../../repositories/transactionRepository');
const { BalanceRepository } = require('../../repositories/balanceRopository');


const makeTransfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;
    const transferData = { fromAccountId, toAccountId, amount };

    const transfer = await accountUseCases.makeTransaction(transferData, AccountRepository, BalanceRepository);
    await transactionUseCases.createTransaction(transferData, TransactionRepository);

    responseSuccess(res, transfer, httpStatus.CREATED);
  } catch (error) {
    responseError(res, error.message, {}, httpStatus.BAD_REQUEST);
  }
}

const getTransactionHistory = async (req, res) => {
  try {
    console.log("========= getTransactionHistory")
    const { page, size } = req.query;
    const { accountId } = req.params;
 
    const isOwner = await accountUseCases.isOwner({ fromAccountId: Number(accountId), userId: req.userId }, AccountRepository);
     
    const isAdmin = req.role == "ADMIN";
    if(!isAdmin && !isOwner) throw new Error('Account not found')
    const transactionData = { accountId, page, size };
    const historial = await transactionUseCases.getTransactionHistory(transactionData, TransactionRepository)
    responseSuccess(res, historial, httpStatus.OK);
  } catch (error) {
    responseError(res, error.message, [], httpStatus.BAD_REQUEST);
  }
}



module.exports = { getTransactionHistory, makeTransfer, };