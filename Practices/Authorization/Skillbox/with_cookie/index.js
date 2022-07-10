const express = require("express")
const bodyParser = require("body-parser")
const nunjucks = require("nunjucks")
const cookieParser = require("cookie-parser")

const app = express()

const generatorId = () => (Math.random() * Date.now()).toString()

const DB = {
    users: [
        {
            _id: generatorId(),
            username: "admin",
            password: "root1234",
            books: 0,
        },
    ],
    sessions: {},
}

//! методи для роботи із DB ==============
const findUserByUsername = async (username) =>
    DB.users.find((u) => u.username === username)
const findUserBySessionId = async (sessionId) => {
    const userID = DB.sessions[sessionId] //? знайшли користувача в сесії
    if (!userID) {
        return
    }
    return DB.users.find((u) => u._id === userID)
}
const createSession = async (userId) => {
    const sessionId = generatorId()
    DB.sessions[sessionId] = userId
    return sessionId
}

const deleteSession = async (sessionId) => {
    delete DB.sessions[sessionId]
}
//! ==============
nunjucks.configure("views", {
    autoescape: true,
    express: app,
})
app.set("view engine", "njk")
app.use(cookieParser())

//? кастомний middleware для перевірки cookie
const auth = () => async (req, res, next) => {
    if (!req.cookies["sessionId"]) {
        return next()
    }
    const user = await findUserBySessionId(req.cookies["sessionId"])
    //? якщо ми знайшли в сесії передаємо дані в req
    req.user = user
    req.sessionId = req.cookies["sessionId"]
    next()
}
app.get("/", auth(), (req, res) => {
    res.render("index.njk", {
        user: req.user,
        authError: req.query.authError === "true",
    })
})
app.post(
    "/login",
    bodyParser.urlencoded({ extended: false }), //? middleware для роботи із даними
    async (req, res) => {
        const { username, password } = req.body

        const user = await findUserByUsername(username)

        //? якщо користувачів немає, або пароль неправильний то редіректимо на authError
        if (!user || user.password !== password) {
            return res.redirect("/?authError=true")
        }
        const sessionId = await createSession(user._id) //? створюємо сесію, якщо даний користувач існуєв бд

        res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/") //? записуємо дані сесії в кукі, які не доступні на клієнті
    }
)

//? для визначення користувача, якому потрібно змінити counter
app.post("/api/add-book", auth(), async (req, res) => {
    if (!req.user) {
        return res.sendStatus(401)
    }
    const user = await findUserByUsername(req.user.username)
    user.books += 1
    res.json({ books: user.books })
})

//? також потребує auth, щоб знати кого розлогінити
app.get("/logout", auth(), async (req, res) => {
    //? якщо юреаз немає по даному посиланню
    if (!req.user) {
        return res.redirect("/")
    }
    await deleteSession(req.sessionId)
    res.clearCookie("sessionId").redirect("/")
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(` Listening http://localhost:${port}`))
