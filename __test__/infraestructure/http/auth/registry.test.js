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

describe('User Routes register', () => {

  describe('POST api/v1/auth/register', () => {

    beforeAll(async () => {
      await User.sync({})
      const found = await User.findOne({ where: { username: 'test001' } })
      if (found) await User.destroy({ where: { username: 'test001' } })
    });

    it('should can register as user', async () => {
      const correctMockUser = { username: 'test001', password: 'test001' }

      const res = await request.post('/api/v1/auth/register').send(correctMockUser)
      expect(res.status).toBe(httpStatus.OK);
    });

    it('should cant register same data', async () => {
      const reapetMockUser = { username: 'test001', password: 'test001' }

      const res = await request.post('/api/v1/auth/register').send(reapetMockUser)
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should cant register username typeof number', async () => {
      const incorrectMockUser = { username: 123456, password: 'test001' }

      const res = await request.post('/api/v1/auth/register').send(incorrectMockUser)
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should cant register password min 6 characteres', async () => {
      const incorrectMockUser = { username: "test002", password: 'test0' }

      const res = await request.post('/api/v1/auth/register').send(incorrectMockUser)
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.body.password).toContainEqual("The password must be at least 6 characters long");
    });

    it('should cant register username min 3 characteres', async () => {
      const incorrectMockUser = { username: "te", password: 'test001' }

      const res = await request.post('/api/v1/auth/register').send(incorrectMockUser)
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.body.username).toContainEqual("The username must be at least 3 characters long");
    });

  });

});
