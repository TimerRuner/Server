const express = require("express")
const nunjucks = require("nunjucks")

const app = express()
// app.set("view engine", "ejs") //? вказуємо, що за відображення відповідає ejs
nunjucks.configure("views", {
    autoescape: true,
    express: app,
})
app.set("view engine", "njk") //? вказуємо, що за відображення відповідає njk
app.use(express.json()) //? middleware для роботи із json
app.use(express.static("public")) //? доступ до фавіконок

let count = 0

const uikitCss =
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.14.3/css/uikit-core.min.css"/>'
// const escapeHTML = (html) =>
//     html.replace(/</g, "&lt").replace(/>/g, "&gt").replace(/"/g, "&quot")

app.post("/inc", (req, res) => {
    count += 1
    res.json({ count })
})
app.get("/", (req, res) => {
    const counts = []
    for (let i = 0; i < counts.length; i++) {
        counts.push(99 - i)
    }
    //? рендеримо файл-шаблон і передаємо в нього параметри ззовні
    res.render("index.njk", { count, uikitCss, counts })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(` Listening http://localhost:${port}`))
