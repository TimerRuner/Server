const jwt = require("jsonwebtoken")
const { secret } = require("../config")
//! мідлварена для роботи із токеном
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(403).json({ message: "User is unregistered" })
        }
        const decodedData = jwt.verify(token, secret) //? розкодовуємо token
        req.user = decodedData
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: "User is unregistered" })
    }
}
