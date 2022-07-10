const Router = require("../framework/Router")
const controller = require("./user-controller.ts")

const router = new Router()

router.get("/users", controller.getUsers)

router.post("/users", controller.createUser)

module.exports = router
