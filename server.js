require("dotenv").config()

// node
const express = require("express")
const app = express()
const cors = require("cors")
const router = express.Router()
const path = require("path")
const expressEjsLayout = require("express-ejs-layouts")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")
const bcrypt = require("bcrypt")

// db config
const db = require("./models")

db.sequelize.sync()

// db.sequelize.drop()
// db.Ogloszenia.count().then((response) => console.log(response))

const defaultEmail = process.env.defaultEmail
const defaultPassword = process.env.defaultPassword

//if no Users in db create default User from env var
db.Users.count()
  .then((countResponse) => {
    if (!countResponse) {
      const defaultUser = {
        email: defaultEmail,
        password: defaultPassword,
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(defaultPassword, salt, async (err, hash) => {
          if (err) throw err
          defaultUser.password = hash

          db.Users.create(defaultUser)
            .then(() =>
              console.log("Poprawnie utworzono standardowego uzytkownika")
            )
            .catch((err) => console.log(err))
        })
      })
    }
  })
  .catch((err) => {
    console.log(err)
  })

//passport config
require("./config/passport")(passport)

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use(expressEjsLayout)
app.use(express.json())
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")))
app.use("/assets", express.static(path.resolve(__dirname, "assets")))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: true }))
app.options("*", cors())

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

// app.use("/admin", router)

// routings
// require("./routes/index")(app)
// require("./routes/dashboard")(app)

app.use("/admin/", require("./routes/index"))
app.use("/admin/dashboard", require("./routes/dashboard"))

//api
app.use("/admin/api", require("./routes/api/index"))
app.use("/admin/api/email", require("./routes/api/email"))

// start server
app.listen(3050, () => console.log("Express server listening"))
