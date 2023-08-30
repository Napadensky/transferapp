const { responseSuccess, responseError } = require('../response');
const userUseCases = require('../../../application/userUseCases');
const httpStatus = require('http-status');
const { UserRepository } = require('../../repositories/userRepository');

const register = async (req, res) => {
  try {
    const newUser = await userUseCases.registerUser(req.body, UserRepository);
    responseSuccess(res, { userId: newUser.id });
  } catch (error) {
    if (error.message === 'User already exists') {
      responseError(res, error.message, null, httpStatus.BAD_REQUEST);
    } else { 
      responseError(res, 'Registration failed');
    }
  }
};

const login = async (req, res) => {
  try {
    const loginData = await userUseCases.loginUser(req.body, UserRepository);
    responseSuccess(res, loginData);
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Invalid password') {
      responseError(res, error.message, null, httpStatus.UNAUTHORIZED);
    } else {
      responseError(res, 'Login failed', error.message);
    }
  }
};

module.exports = { register, login };
