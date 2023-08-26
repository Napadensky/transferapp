const express = require('express');

const userController = require('../controllers/userController');

const validatorMiddleware = require('../middlewares/validatorMiddleware');

const { registerSchema, loginSchema } = require('../../../domain/user');

const router = express.Router();

router.post('/register', validatorMiddleware(registerSchema), userController.register);
router.post('/login', validatorMiddleware(loginSchema), userController.login);

module.exports = router;
