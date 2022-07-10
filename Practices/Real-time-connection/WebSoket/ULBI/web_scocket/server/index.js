const express = require("express")
const app = express()
const WSserver = require("express-ws")(app)
const aWss = WSserver.getWss() //? отримуємо усіх клієнтів, що підключились до сокета
const cors = require("cors")
const PORT = process.env.PORT || 5000
const fs = require("fs")
const path = require("path")

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log(` Server started on PORT ${PORT}`))

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach((client) => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

//? ловимо запити із клієнського сокета
app.ws("/", (ws, req) => {
    ws.on("message", (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                connectionHandler(ws, msg)
                break
        }
    })
})

//? синхронізація завдяки якій людина, яка отримала посилання зможе побачити чужий стан canvas
app.post("/image", (req, res) => {
    //? кожен раз при малюванні файлу, ми його дозаписуємо
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, "") //? видаляємо це із закодованої картинки
        fs.writeFileSync(
            path.resolve(__dirname, "files", `${req.query.id}.jpg`),
            data,
            "base64"
        )
        return res.status(200).json({ message: "downloaded" })
    } catch (error) {
        console.log(error)
        return res.status(500).json("error")
    }
})
app.get("/image", (req, res) => {
    try {
        const file = fs.readFileSync(
            path.resolve(__dirname, "files", `${req.query.id}.jpg`)
        )
        const data = `data:image/png;base64,` + file.toString("base64")
        res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json("error")
    }
})
