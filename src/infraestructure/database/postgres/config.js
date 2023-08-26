require('dotenv').config()
const { Sequelize } = require('sequelize');

// obtener datos de coneccion de variables de entorno
const database = process.env.SEQUELIZE_DB_DATABASE;
const username = process.env.SEQUELIZE_DB_USERNAME;
const password = process.env.SEQUELIZE_DB_PASSWORD;
// OPT DB
const host = process.env.SEQUELIZE_DB_HOST;
const port = process.env.SEQUELIZE_DB_PORT;
const dialect = process.env.SEQUELIZE_DB_DIALECT;


const sequelize = new Sequelize(database, username, password, {
  port, host, dialect, logging: false, dialectOptions: {
    socketPath: host, 
  },
},);

const serverPostgres = async () => {
  try {
    await sequelize.sync()
    console.log("==> DB is connected");



  } catch (error) {
    console.log("==> ERROR DB ", error.message);
    process.exit(-1);
  }
};

module.exports = { serverPostgres, sequelize };

