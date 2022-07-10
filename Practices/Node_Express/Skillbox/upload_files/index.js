const express = require("express")
const nunkucks = require("nunjucks")
const path = require("path")
const fs = require("fs")
const multer = require("multer")

const app = express()
const PORT = process.env.PORT || 3000
const uploadsDir = path.join(__dirname, "public", "uploads")

const fileFilter = (req, file, cb) => {
    cb(null, file.mimetype.match(/^image\//)) //? пеервірка, що файл є картинкою
}
const upload = multer({
    dest: uploadsDir,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
})

nunkucks.configure("views", {
    autoescape: true,
    express: app,
})

app.set("view engine", "njk")
app.use(express.static("public"))

app.get("/", async (req, res) => {
    //! реалізувати функціонал читання картинок
    const files = [].sort().reverse()
    res.render("index.njk", { files })
})
//? upload на даний url форма відсилає запит
//? даний міддлвейр працює із картинкою яка є в полі з даний іменем image
app.post("/upload", upload.single("image"), (req, res) => {
    res.redirect("/")
})

app.listen(PORT, () => console.log(` Listening http://localhost:${PORT}`))
