const Router = require("express").Router
const userController = require("../controllers/user-controller")
const { body } = require("express-validator") //? функція для задання умови валідації
const authMiddleware = require("../middlewares/auth_middleware")

const router = new Router()

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }),
    userController.registration
) //? реєстрація
router.post("/login", userController.login) //? логін
router.post("/logout", userController.logout) //? вихід і видалення refresh token
router.get("/activate/:link", userController.activate) //? активація акаунта по посиланню, яка прийде на пошту
router.get("/refresh", userController.refresh) //? перезапис access token в випадку його смерті (відсилаємо refresh token)
router.get("/users", authMiddleware, userController.getUsers) //? отримати список користувачів, тільки для авторизованих

module.exports = router
