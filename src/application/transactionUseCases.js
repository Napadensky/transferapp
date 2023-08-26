const trasactionUseCases = {}

trasactionUseCases.createTransaction = async (transactionData, TransactionRepository) => {
  return await TransactionRepository.create(transactionData);
}

trasactionUseCases.getTransactionHistory = async (transactionData, TransactionRepository) => {
  return await TransactionRepository.getTransactionsById(transactionData);
}

module.exports = trasactionUseCases;