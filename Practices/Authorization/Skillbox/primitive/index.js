const express = require("express")
const basicAuth = require("express-basic-auth")

const app = express()

//? запитує пароль і логін для переходу по будь-якому роуту (слугує для надання доступу до сайту лише для коієнта)
app.use(
    basicAuth({
        realm: "Web.",
        challenge: true,
        users: {
            admin: process.env.PASSWORD,
        },
    })
)

app.get("/", (req, res) => {
    res.send("welcome")
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(` Listening on http://localhost:${port}`)
})
