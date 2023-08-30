const supertest = require('supertest');
const express = require('express');
const appRoot = require('app-root-path');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const { Transaction } = require(appRoot + '/src/infraestructure/repositories/transactionRepository');
const { Account } = require(appRoot + '/src/infraestructure/repositories/accountRepository');
const { User } = require(appRoot + '/src/infraestructure/repositories/userRepository');

const route = require(appRoot + '/src/infraestructure/http/routers/index')

const app = require("express")();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route())

const request = supertest(app)
const jwtSecret = process.env.JWT_SECRET_KEY

const tokenOne = jwt.sign({ userId: 1, role: "ADMIN" }, jwtSecret, { expiresIn: '1h' });

describe('Transaction Routes', () => {

  describe('POST api/v1/transaction', () => {

    beforeAll(async () => {
      try {
        await User.sync({ force: true })
        await Account.sync({ force: true })
        await Transaction.sync({ force: true })
      } catch (error) {
        console.log(error.message)
      }

    });

    it('should return 400 when transaction dont found the accounts', async () => {

      const response = await request
        .post('/api/v1/transfers')
        .auth(tokenOne, { type: 'bearer' })
        .send({ "fromAccountId": 95, "toAccountId": 99, "amount": 100 });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toEqual("Once Account not found");
    });


  });
})