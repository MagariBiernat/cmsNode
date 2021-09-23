// module.exports = (app) => {
const router = require("express").Router()
const { ensureAuthenticated } = require("../config/auth")
const controller = require("../controllers/dashboard.controller")

router.get("/", ensureAuthenticated, controller.getDashboard)

router.get("/all", ensureAuthenticated, controller.getDashboardAll)

router.get("/add", ensureAuthenticated, controller.getDashboardAdd)

router.post("/add", ensureAuthenticated, controller.postDashboardAdd)

router.get("/:id", ensureAuthenticated, controller.getDashboardSingle)

router.get("/edit/:id", ensureAuthenticated, controller.getDashboardSingleEdit)

router.post(
  "/edit/:id",
  ensureAuthenticated,
  controller.postDashboardSingleEdit
)

router.post(
  "/delete/:id",
  ensureAuthenticated,
  controller.postDashboardSingleDelete
)

router.get(
  "/edit/images/:id",
  ensureAuthenticated,
  controller.getDashboardSingleEditImage
)

router.post(
  "/edit/images/delete",
  ensureAuthenticated,
  controller.postDashboardSingleEditImageDelete
)
router.post(
  "/edit/images/add",
  ensureAuthenticated,
  controller.postDashboardSingleEditImageAdd
)

module.exports = router
// app.use("/dashboard", router)
// }
