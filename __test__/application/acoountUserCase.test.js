const appRoot = require('app-root-path');

const usecase = require(appRoot + '/src/application/accountUseCases');

jest.mock('../../src/infraestructure/repositories/accountRepository', () => {
  return { findByTypeAccount: jest.fn(), create: jest.fn(), updateAccountStatus: jest.fn(), }
});

describe('createAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if account type already exists and is open', async () => {
    const mockAccountData = { type: 'BasicSavings' };
    const mockAccountRepository = {
      findByTypeAccount: jest.fn().mockResolvedValue({ status: 'OPEN' }),
    };

    await expect(usecase.createAccount(mockAccountData, mockAccountRepository)).rejects.toThrow('AccountType already exists');
  });

  it('should reopen a closed account', async () => {
    const mockAccountData = { type: 'BasicSavings' };
    const mockAccountRepository = {
      findByTypeAccount: jest.fn().mockResolvedValue({ id: 1, status: 'CLOSED' }),
      updateAccountStatus: jest.fn().mockResolvedValue({ id: 1, status: 'OPEN' }),
    };

    const result = await usecase.createAccount(mockAccountData, mockAccountRepository);
    expect(result).toEqual({ id: 1, status: 'OPEN' });
  });

  it('should create a new account if no existing account of the same type is found', async () => {
    const mockAccountData = { type: 'BasicSavings' };
    const mockAccountRepository = {
      findByTypeAccount: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 2, type: 'BasicSavings' }),
    };

    const result = await usecase.createAccount(mockAccountData, mockAccountRepository);
    expect(result).toEqual({ id: 2, type: 'BasicSavings' });
  });
});

