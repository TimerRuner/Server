const express = require("express")
const cors = require("cors")
const events = require("events")
const PORT = 5000

const emitter = new events.EventEmitter()

const app = express()

app.use(cors())
app.use(express.json())

//? користувач відправляє get запит, але ми не повертаємо результат, ми підписуємось на подію і чекаємо
app.get("/get-messages", (req, res) => {
    emitter.once("newMessage", (message) => {
        res.json(message)
    })
})

//? коли інший учасник чату відправив повідомлення , ми викликаємо подію на яку підписались і всім учасникам повертаємо відповідь
app.post("/new-messages", (req, res) => {
    const message = req.body
    emitter.emit("newMessage", message)
    res.status(200)
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
