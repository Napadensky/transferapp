const httpStatus = require('http-status');

const responseSuccess = (res, data, status) => {
  const statusCode = status ?? httpStatus.OK;
  const payload = {
    error: null,
    body: data ?? httpStatus[200],
    status: statusCode
  }
  return res.status(statusCode).json(payload);
}

const responseError = (res, error, data, status) => {
  const statusCode = status ?? httpStatus.INTERNAL_SERVER_ERROR;
  const payload = {
    error: error ?? httpStatus[500],
    body: data ?? null,
    status: statusCode
  }
  return res.status(statusCode).json(payload);
}

module.exports = { responseSuccess, responseError }