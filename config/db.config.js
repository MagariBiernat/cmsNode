require("dotenv").config()

module.exports = {
  HOST: process.env.host,
  USER: process.env.user,
  PASSWORD: process.env.password,
  DB: process.env.db_name,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
  },
  timezone: "+02:00",
}
