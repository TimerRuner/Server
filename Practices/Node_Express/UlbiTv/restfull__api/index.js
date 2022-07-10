import express from "express"
import mongoose from "mongoose"
import router from "./router.js"
import fileUpload from "express-fileupload"

const PORT = 5000
const DB_URL = `mongodb+srv://vadimas:root1234@cluster0.kmn3nrs.mongodb.net/?retryWrites=true&w=majority`

const app = express()

//? middleware
//? по замовчуванню epxress не може працювати із json даними, тому використовуємо middleware
app.use(express.json())
//?вигрузка статичних файлів із сервера
app.use(express.static("static"))
//? Для роботи із файлами
app.use(fileUpload({}))
//? endpoint для роутінгу
app.use("/api", router)

//? підключення до bd
async function startApp() {
    try {
        await mongoose.connect(DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        app.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()
