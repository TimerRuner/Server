const express = require("express")
const cors = require("cors")
const events = require("events")
const PORT = 5000

const emitter = new events.EventEmitter()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/connect", (req, res) => {
    res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    })
    //? так як з'єднання в нас нескінченне, викликаємо трігер on
    emitter.on("newMessage", (message) => {
        res.write(`data: ${JSON.stringify(message)} \n\n`) //? спец шаблон для повернення даних
    })
})

app.post("/new-messages", (req, res) => {
    const message = req.body
    emitter.emit("newMessage", message)
    res.status(200)
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
