require("dotenv").config()

const WebSoket = require("ws")
const http = require("http")
const express = require("express")

const app = express()
app.use(express.static("public")) //? дозволяємо серверу використовувати статику

const server = http.createServer(app)
const wss = new WebSoket.Server({ server }) //? автоматично опрацьовує з'єднання

//? ловимо дані із клієнта
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        wss.clients.forEach((ws) => {
            ws.send(message)
        })
    })
})

server.listen(process.env.PORT, () =>
    console.log(` Server running on http://localhost:${process.env.PORT}`)
)
