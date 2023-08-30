const supertest = require('supertest');
const express = require('express');
const appRoot = require('app-root-path');
const httpStatus = require('http-status');

const { User } = require(appRoot + '/src/infraestructure/repositories/userRepository');
const route = require(appRoot + '/src/infraestructure/http/routers/index')

const app = require("express")();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route())

const request = supertest(app)

describe('User Routes login', () => {

  describe('POST api/v1/auth/login', () => {

    beforeAll(async () => {
      await User.sync({force: true})
      const found = await User.findOne({ where: { username: 'test001' } })
      if (found) await User.destroy({ where: { username: 'test001' } })
    });

    it('should login', async () => {
      const correctMockUser = { username: 'test001', password: 'test001' }

      await request.post('/api/v1/auth/register').send(correctMockUser)

      const res = await request.post('/api/v1/auth/login').send(correctMockUser)
      expect(res.status).toBe(httpStatus.OK);
      // expect(Object.keys(res.body.body)).toContainEqual('token');
    });

    it('should cant login with incorrect credential', async () => {
      const incorrectCredentalMockUser = { username: 'test002', password: 'test002' }


      const res = await request.post('/api/v1/auth/login').send(incorrectCredentalMockUser)
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });

  });

});
