require("dotenv").config()

const WebSoket = require("ws")

const wss = new WebSoket.Server({ port: process.env.PORT })

//? ловимо дані із клієнта
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        wss.clients.forEach((ws) => {
            ws.send(message)
        })
    })
})
