require("dotenv").config()
require("./infraestructure/cron/index")

const { serverPostgres } = require("./infraestructure/database/postgres/config")
const serverHttp = require("./infraestructure/http/server")



console.clear()
console.log("===============")
console.log("STARTING APP...")
console.log("===============")

serverPostgres()
const app = serverHttp()

module.exports = app