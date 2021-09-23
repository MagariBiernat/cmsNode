const validateLoginInput = require("../validators/login")
const passport = require("passport")

exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/admin/dashboard")
  }
  let message = req.session.message
  req.session.message = null
  res.render("index", {
    msg: message,
    isAuthenticated: false,
    title: "CMS - login",
  })
}

exports.postLogin = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body)

  if (!isValid) {
    req.session.message = errors
    return res.redirect("/admin/")
  }

  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/",
    failureFlash: true,
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  req.session.message = "You were logged out"
  res.redirect("/admin/")
}
