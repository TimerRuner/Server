import express from "express"
import path from "path"
import { requestTime, logger } from "./middlewares.js"
import serverRoutes from "./router/servers.js"

//! Ініціалізація
const app = express()
const PORT = process.env.PORT ?? 3000
const __dirname = path.resolve()

//! Взаємодія із пакетами
//? Встановлюємо значення змінної в конкретне значення
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "ejs")) //!змінюємо деректорію яка закріплена зацією змінною

//! добавлення middleware
//? тепер при get запиті, ми звертатимемось в static і видаватимемо файл для рендеренгу
//? шлях в url прописувати з добавленням розширень
app.use(express.static(path.resolve(__dirname, "static")))
app.use(requestTime)
app.use(logger)
//? middleware для коректної роботи сервера із json при відправці post запитів
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(serverRoutes)

//! Опрацювання конкретних get запитів, req - запит, res - відповідь

//? Сторінки із ejs можна редагувати із express
app.get("/", (req, res) => {
    res.render("index", { title: "Main page", active: "main" })
})
app.get("/features", (req, res) => {
    res.render("features", { title: "Features page", active: "features" })
})

// app.get("/", (req, res) => {
//     // res.send("<h1>Hello Express</h1>")
//     res.sendFile(path.resolve(__dirname, "static/index.html"))
// })
// app.get("/features", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "static/features.html"))
// })
// app.get("/download", (req, res) => {
//     console.log(req.requestTime)
//     //? Скачування конкретної сторінки при переході на даний роут
//     res.download(path.resolve(__dirname, "static/features.html"))
// })

//! Створення базововго веб сервера на конкретному порті
app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`)
})
