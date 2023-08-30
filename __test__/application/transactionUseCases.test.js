const appRoot = require('app-root-path');

const trasactionUseCases = require(appRoot + "/src/application/transactionUseCases");

jest.mock(appRoot + '/src/infraestructure/repositories/transactionRepository.js');

describe('trasactionUseCases', () => {
  const mockTransactionRepository = {
    create: jest.fn(),
    getTransactionsById: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const mockTransactionData = { fromAccountId: 1, toAccountId: 2, amount: 100 };
      mockTransactionRepository.create.mockResolvedValue({ id: 1, ...mockTransactionData });

      const result = await trasactionUseCases.createTransaction(mockTransactionData, mockTransactionRepository);
      expect(result).toEqual({ id: 1, ...mockTransactionData });
    });
  });

  describe('getTransactionHistory', () => {
    it('should retrieve transaction history by ID', async () => {
      const mockTransactionData = { accountId: 1 };
      const mockTransactions = [
        { id: 1, fromAccountId: 1, toAccountId: 2, amount: 100 },
        { id: 2, fromAccountId: 1, toAccountId: 3, amount: 50 },
      ];
      mockTransactionRepository.getTransactionsById.mockResolvedValue(mockTransactions);

      const result = await trasactionUseCases.getTransactionHistory(mockTransactionData, mockTransactionRepository);
      expect(result).toEqual(mockTransactions);
    });
  });
});

