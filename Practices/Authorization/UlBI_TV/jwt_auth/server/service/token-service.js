//! бізнес логіка роботи із токеном
require("dotenv").config()
const jwt = require("jsonwebtoken")
const tokenModel = require("../models/token-model")

class TokenService {
    //** payload - id, email, isActivated */
    generateTokens(payload) {
        //? вказуємо токен доступу
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "30m",
        })
        //? вказуємо токен для відновлення access_token
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        })

        return {
            accessToken,
            refreshToken,
        }
    }

    //? збереження токена в бд
    async saveToken(userId, refreshToken) {
        //? якщо користувач вже логінився - перезаписуємо його refresh token
        const tokenData = await tokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await tokenModel.create({ user: userId, refreshToken })
        return token
    }

    async removeToken(refreshToken) {
        //? видаляємо з бази токен для користувача, який вилогінюється
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData
    }

    async findToken(refreshToken) {
        //? знаходимо токен в бд
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }

    //! функція для перевірки токена, на оригінальність, свіжість
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) //? верифікуємо токен
            return userData
        } catch (error) {
            return null
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) //? верифікуємо токен
            return userData
        } catch (error) {
            return null
        }
    }
}

module.exports = new TokenService()
