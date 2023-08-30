const appRoot = require('app-root-path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userUseCases = require(appRoot + '/src/application/userUseCases');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock(appRoot + '/src/infraestructure/repositories/userRepository.js');

describe('userUseCases', () => {
  const mockUserRepository = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should throw an error if user already exists', async () => {
      const mockUserData = { username: 'testUser', password: 'testPass' };
      mockUserRepository.findByUsername.mockResolvedValue(mockUserData);

      await expect(userUseCases.registerUser(mockUserData, mockUserRepository)).rejects.toThrow('User already exists');
    });

    it('should register a new user', async () => {
      const mockUserData = { username: 'testUser', password: 'testPass' };
      mockUserRepository.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockResolvedValue({ id: 1, ...mockUserData, password: 'hashedPassword' });

      const result = await userUseCases.registerUser(mockUserData, mockUserRepository);
      expect(result).toEqual({ id: 1, ...mockUserData, password: 'hashedPassword' });
    });
  });

  describe('loginUser', () => {
    it('should throw an error if user not found', async () => {
      const mockLoginData = { username: 'testUser', password: 'testPass' };
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(userUseCases.loginUser(mockLoginData, mockUserRepository)).rejects.toThrow('User not found');
    });

    it('should throw an error if password is invalid', async () => {
      const mockLoginData = { username: 'testUser', password: 'testPass' };
      mockUserRepository.findByUsername.mockResolvedValue({ id: 1, ...mockLoginData, password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(userUseCases.loginUser(mockLoginData, mockUserRepository)).rejects.toThrow('Invalid password');
    });

    it('should login a user and return a token', async () => {
      const mockLoginData = { username: 'testUser', password: 'testPass' };
      mockUserRepository.findByUsername.mockResolvedValue({ id: 1, ...mockLoginData, password: 'hashedPassword', role: 'user' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('testToken');

      const result = await userUseCases.loginUser(mockLoginData, mockUserRepository);
      expect(result).toEqual({ token: 'testToken', userId: 1 });
    });
  });
});
