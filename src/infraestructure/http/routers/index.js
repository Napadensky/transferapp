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
  const routes = [router.get('/api/v1/health', (_req, res) => {
    const filePath = path.join(__dirname, '../../../../demoUsers.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error al leer el archivo');
        return;
      }

      // Verificar si data tiene contenido
      if (!data || data.trim() === '') {
        res.status(400).send('El archivo JSON está vacío');
        return;
      }

      let convertJSON;
      try {
        convertJSON = JSON.parse(data);
        console.log(convertJSON);
        responseSuccess(res, { message: "OK", usersdemo: convertJSON }, httpStatus.OK);
      } catch (error) {
        console.error('Error al analizar el JSON:', error);
        res.status(500).send('El contenido del archivo no es un JSON válido');
      }
    });
  })];

  routes.push(router.use("/api/v1/auth", userRoute))
  routes.push(router.use("/api/v1/accounts", authMiddleware, accountRoute))
  routes.push(router.use("/api/v1/transfers", authMiddleware, transferRoute))

  return routes;
}

module.exports = manageRouter;