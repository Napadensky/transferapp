const express = require('express');
const fs = require('fs');
const path = require('path');

const { responseSuccess } = require('../response');

const authMiddleware = require('../middlewares/authMiddleware');

const userRoute = require('./userRoute')
const accountRoute = require('./accountRoute');
const transferRoute = require('./transferRoute');
const httpStatus = require('http-status');

const router = express.Router();

const manageRouter = () => {
  const routes = [router.get('/health', async (_req, res) => {
    const filePath = path.join(__dirname, '../../../../demoUsers.json');
    const data = await fs.readFileSync(filePath, 'utf8');
    responseSuccess(res, { message: "OK", usersdemo: data }, httpStatus.OK)

  })]

  routes.push(router.use("/api/v1/auth", userRoute))
  routes.push(router.use("/api/v1/accounts", authMiddleware, accountRoute))
  routes.push(router.use("/api/v1/transfers", authMiddleware, transferRoute))

  return routes;
}

module.exports = manageRouter;