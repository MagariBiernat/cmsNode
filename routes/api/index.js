const router = require("express").Router()
const controller = require("../../controllers/api.controller")

router.get("/single", controller.getSingle)

router.get("/all", controller.getAll)

module.exports = router
