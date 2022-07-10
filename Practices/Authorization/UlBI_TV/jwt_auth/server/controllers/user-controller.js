//! контроллер для реалізації функцій роутінга
const userService = require("../service/user-service")
const { validationResult } = require("express-validator") //? функція для повернення результату продедення валідації
const ApiError = require("../exceptions/api-error")

class UserController {
    async registration(req, res, next) {
        try {
            //! Перевіряємо запит на помилки
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest("Error validation", errors.array()) //? при помилці валідації - в мідлварину передаємо результат функції нашого класу
                )
            }
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 1000,
                httpOnly: true, //? забороняє нам получати і змінювати куку із браузера
            })
            return res.json(userData)
        } catch (error) {
            next(error) //? прокидаємо помилку в мідлварину
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            //? при успішному логіні, освіжаємо reafreshToken
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 1000,
                httpOnly: true, //? забороняє нам получати і змінювати куку із браузера
            })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)

            //? очищаємо токен при виході
            res.clearCookie("refreshToken")
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL) //? адрес фронтенду, так як він може бути на іншому хості
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 1000,
                httpOnly: true, //? забороняє нам получати і змінювати куку із браузера
            })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()
