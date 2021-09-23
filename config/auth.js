module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.session.message = "Please log in first"
    res.redirect("/admin/")
  },
}
