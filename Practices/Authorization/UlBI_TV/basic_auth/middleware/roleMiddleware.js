const { secret } = require("../config")
//! модуль приймає ролі по яким дозволяє отримати доступ до даних
module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(" ")[1]
            if (!token) {
                return res.status(403).json({ message: "User is unregistered" })
            }
            const { roles: userRoles } = token.verify(token, secret)
            let hasRole = false
            userRoles.forEach((role) => {
                if (roles.includes(role)) {
                    //? перевіряємо чи є права в даного користувача
                    hasRole = true
                }
            })
            //? якщо роль користувача в токені не рівна вказній нами в правах доступу, то дані не виводимо
            if (!hasRole) {
                return res.status(403).json({ message: "You haven't access" })
            }
            next()
        } catch (error) {
            console.log(error)
            return res.status(403).json({ message: "User is unregistered" })
        }
    }
}
