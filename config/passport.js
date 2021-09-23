const LocalStrategy = require("passport-local").Strategy
const db = require("../models")
const bcrypt = require("bcrypt")

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      db.Users.findOne({ raw: true, where: { email } })
        .then((user) => {
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: "Wrong credentials" })
            }
          })

          if (!user) {
            return done(null, false, { message: "No user found" })
          }
        })
        .catch((err) => {
          return done(err)
        })
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.userId)
  })

  passport.deserializeUser((id, done) => {
    db.Users.findByPk(id, { raw: true })
      .then((user) => {
        return done(null, user)
      })
      .catch((err) => {
        return done(err, null)
      })
  })
}
