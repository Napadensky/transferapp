require('dotenv').config();

module.exports = {
  "development": {
    "database": process.env.SEQUELIZE_DB_DATABASE,
    "username": process.env.SEQUELIZE_DB_USERNAME,
    "password": process.env.SEQUELIZE_DB_PASSWORD,
    "host": process.env.SEQUELIZE_DB_HOST,
    "dialect": process.env.SEQUELIZE_DB_DIALECT,
    "port": process.env.SEQUELIZE_DB_PORT
  }
}