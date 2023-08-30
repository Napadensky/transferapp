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

describe('Balance Routes', () => {

  describe('GET api/v1/accounts/:accountId/balances', () => {

    beforeAll(async () => {
    });

    it('should return 200 when give balance', async () => {
      const response = await request
      .get('/api/v1/accounts/5/balances?page=2&size=5')
      .auth(token, { type: 'bearer' })
 
      expect(response.status).toBe(httpStatus.OK);
    });

  });
})