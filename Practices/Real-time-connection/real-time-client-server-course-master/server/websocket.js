const ws = require("ws")

//? запускаємо ws сервер
const wss = new ws.Server(
    {
        port: 5000,
    },
    () => console.log(`Server started on 5000`)
)

//? коли клієнт підключається до websocket спрацює дана подія
wss.on("connection", function connection(ws) {
    //? коли на сервер приходить повідомлення від клієнта
    //? ws - одне конкретне підключення одного користувача
    ws.on("message", function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case "message":
                broadcastMessage(message)
                break
            case "connection":
                broadcastMessage(message)
                break
        }
    })
})

//? функція яка дозволяє нам надіслати повідомлення одразу усім користувачам
function broadcastMessage(message, id) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message))
    })
}
