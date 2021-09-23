// module.exports = (app) => {
const router = require("express").Router()
const controller = require("../controllers")

router.get("/", controller.getLogin)

router.post("/login", controller.postLogin)

router.get("/logout", controller.logout)

module.exports = router

//   app.use("/", router)
// }
