//! Декомпозований контроллер із методами для взаємодії в Router
const User = require("./models/User")
const Role = require("./models/Role")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const { secret } = require("./config")

const generateAccessToken = (id, roles) => {
    //? об'єкт, який ми зберігаємо в токен
    const payload = {
        id,
        roles,
    }

    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req) //? функція для валідації отриманих з клієнта даних
            //? якщо є помилки - повертаємо їх
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Errors registration", errors })
            }
            const { username, password } = req.body
            const candidate = await User.findOne({ username })

            //? перевірка на наявність юзера із таким же іменем, користувачі мають бути унікальні
            if (candidate) {
                return res
                    .status(400)
                    .json({ message: "Has user with the same name" })
            }

            //? хешуємо пароль перед записом в бд
            const hashPassword = bcrypt.hashSync(password, 7)
            //? отримуємо необхідну роль
            const userRole = await Role.findOne({ value: "USER" })
            //? створюємо нового юзера
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            })

            await user.save(function () {})
            return res.json({ message: "User registered succesfully" })
        } catch (error) {
            res.status(400).json({ message: "Registration error" })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `User ${username} didn't find` })
            }
            //? якщо користувач є - потрібно порівняти паролі
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: `Wrong password` })
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({ token })
        } catch (error) {
            res.status(400).json({ message: "Login error" })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            res.status(400).json({ message: "user error" })
        }
    }
}

module.exports = new authController()
