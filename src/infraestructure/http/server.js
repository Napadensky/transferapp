const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');

const manageRouter = require('./routers');

const app = express();

const serverHttp = () => {

  const port = process.env.TRANSFER_SERVICE_PORT || 3000;
  const host = process.env.TRANSFER_SERVICE_HOST || 'localhost';
  const url = `http://${host}:${port}`;

  app.use(express.json());
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors())
  app.use(express.urlencoded({ extended: true }));
  app.use(logger('dev'));
  app.use(manageRouter())

  app.use((_req, res, next) => {
    res.status(404).send('Sorry cant find that!');
  });

  app.listen(port, () => {
    if (process.env.NODE_ENV == 'development') {
      console.log("\n===============")
      console.log('Server listening');
      console.log('port:', port);
      console.log('host:', host);
      console.log('env:', process.env.NODE_ENV)
      console.log(`url: ${url}`);
      console.log("===============")
    }
  });
  return app
}

module.exports = serverHttp;