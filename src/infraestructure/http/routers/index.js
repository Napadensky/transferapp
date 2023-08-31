const express = require('express');
const fs = require('fs');
const path = require('path');

const { responseSuccess, responseError } = require('../response');

const authMiddleware = require('../middlewares/authMiddleware');

const userRoute = require('./userRoute')
const accountRoute = require('./accountRoute');
const transferRoute = require('./transferRoute');
const httpStatus = require('http-status');

const router = express.Router();

const manageRouter = () => {
  const routes = [router.get('/api/v1/health', (_req, res) => {
    try {
      const datademo = [
        {
          "name": "Stuart.Beer",
          "pass": "qfIdzdtNxDqLWBj"
        },
        {
          "name": "Hadley_OReilly",
          "pass": "YnwcGHcK5WKEZPN"
        },
        {
          "name": "Baron.Bashirian9",
          "pass": "mh6w21nlSfgT5Hv"
        },
        {
          "name": "Floyd.Schuster",
          "pass": "1gGL6VNxh6g5V1k"
        },
        {
          "name": "Seth.Abbott38",
          "pass": "G16QeE4VwHvaKsE"
        },
        {
          "name": "Curtis.Morar-Schiller",
          "pass": "wTLEyjzM0CkoNXC"
        },
        {
          "name": "Frederic.Waters",
          "pass": "5CIKIILYvmm_nX9"
        },
        {
          "name": "Erwin.OKon22",
          "pass": "qoNCbT7v_erRx1A"
        },
        {
          "name": "Felix.Schmitt57",
          "pass": "Fse2QgsHqpABB9V"
        },
        {
          "name": "Ari.Nolan",
          "pass": "6Cg4YcKeKZMOykw"
        }
      ]
      responseSuccess(res,{message:"OK", datademo}, httpStatus.OK)
    } catch (error) {
      responseError(res, error, {})
    }
  }
  )];

  routes.push(router.use("/api/v1/auth", userRoute))
  routes.push(router.use("/api/v1/accounts", authMiddleware, accountRoute))
  routes.push(router.use("/api/v1/transfers", authMiddleware, transferRoute))

  return routes;
}

module.exports = manageRouter;