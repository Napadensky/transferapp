const supertest = require('supertest');
const express = require('express');
const appRoot = require('app-root-path');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const { Account } = require(appRoot + '/src/infraestructure/repositories/accountRepository');
const route = require(appRoot + '/src/infraestructure/http/routers/index')

const app = require("express")();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route())

const request = supertest(app)
const jwtSecret = process.env.JWT_SECRET_KEY
const token = jwt.sign({ userId: 1, role: "ADMIN" }, jwtSecret, { expiresIn: '1h' });

describe('Account Routes', () => {

  describe('POST api/v1/account', () => {

    beforeAll(async () => {

      await Account.sync({})
      Account.destroy({ where: {} })
    });

    it('should return 201 when account is created', async () => {
      const response = await request
        .post('/api/v1/accounts')
        .auth(token, { type: 'bearer' })
        .send({ "accountType": "Current" });

      expect(response.status).toBe(httpStatus.CREATED);
    });

    it('should return 200 when give account', async () => {
      const response = await request
        .get('/api/v1/accounts')
        .auth(token, { type: 'bearer' })

      expect(response.status).toBe(httpStatus.OK);
    });

    it('should return 200 when close account by id', async () => {
      const acccount = await Account.findOne({ where: { userId: 1 } })

      const response = await request
        .delete('/api/v1/accounts/' + acccount.id)
        .auth(token, { type: 'bearer' })

      expect(response.status).toBe(httpStatus.OK);
    });

  });

});