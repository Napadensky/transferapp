const supertest = require('supertest');
const express = require('express');
const appRoot = require('app-root-path');

const route = require(appRoot + '/src/infraestructure/http/routers')

const app = require("express")();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route())

describe('health Route ', () => {

  describe('GET /health', () => {

    it('should show health ok', async () => {
      const { get } = supertest(app)
      const res = await get('/health')
      expect(res.status).toBe(200);
    });

  });

});
