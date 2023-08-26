const jwt = require('jsonwebtoken');
const { responseError } = require('../response');
const httpStatus = require('http-status');

const authMiddleware = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET_KEY

  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) return responseError(res, 'No token provided', null, 401);

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId; 
    req.role = decoded.role;
    next();
  } catch (error) {
    return responseError(res, 'Invalid token', null, httpStatus.UNAUTHORIZED);
  }
};

module.exports = authMiddleware;
