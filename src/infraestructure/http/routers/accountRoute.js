const express = require('express');

const accountController = require('../controllers/accountController');
const transactionController = require('../controllers/transactionController');

const validatorMiddleware = require('../middlewares/validatorMiddleware');

const { createAccountSchema } = require('../../../domain/account');

const router = express.Router();

router.post('/', validatorMiddleware(createAccountSchema), accountController.createAccount);
router.get('/', accountController.getAccounts);
router.get('/:accountId/balances', accountController.getAccountDetails); 
router.delete('/:accountId', accountController.closeAccount); 

router.get('/:accountId/transactions', transactionController.getTransactionHistory);   

module.exports = router;