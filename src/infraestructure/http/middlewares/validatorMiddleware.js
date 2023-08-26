const { responseError } = require("../response");

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.formErrors.fieldErrors;
      return responseError(res, 'Validation failed', errors, 400);
    }

    req.body = validationResult.data;
    next();
  };
};

module.exports = validateMiddleware;