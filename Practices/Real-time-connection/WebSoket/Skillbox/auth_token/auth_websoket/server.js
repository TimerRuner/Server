require("dotenv").config()

const WebSocket = require("ws")
const http = require("http")
const express = require("express")
const { URL } = require("url")

const app = express()
app.use(express.static("public")) //? дозволяємо серверу використовувати статику

const server = http.createServer(app)

const DB = {
    users: [
        { id: 1, username: "jane", password: "pwd007" },
        { id: 2, username: "joe", password: "pwd008" },
        { id: 3, username: "jack", password: "pwd009" },
    ],
    tokens: {},
}

//? передані параметри говорять, що він в повній ізоляції і не робить трекінг клієнтів, повністю відв'язаний від http сервера
const wss = new WebSocket.Server({ clientTracking: false, noServer: true })
const clients = new Map() //? список усіх клієнтів

app.post("/login", express.json(), (req, res) => {
    //? робимо перевірка на наявність користувачів в бд
    const { username, password } = req.body
    const user = DB.users.find((u) => u.username === username)
    if (!user) {
        return res.status(401).send("Unknown username")
    }
    if (user.password !== password) {
        return res.status(401).send("Wrong password")
    }

    //? при успішному вході - генеруємо токен, записуємо його в сесію (базу де id сесії відповідає id користувача)
    const token = (Math.random() * new Date()).toString()
    //? запам'ятовуємо зв'язку токена і юзера
    DB.tokens[token] = user.id
    res.json({ token })
})

//? прослуховуємо upgrade запит від клієнта, тобто спрацює в момент ініціалізації ws на клієнті
server.on("upgrade", (req, socket, head) => {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`)
    const token = searchParams && searchParams.get("token")
    const userId = token && DB.tokens[token]

    //? якщо токен не правильний чи по даному токену немає клієнта - закриваємо з'єднання
    if (!userId) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
        socket.destroy()
        return
    }

    //? знайшовши юзера по токену ми викликаємо метод wss.handleUpgrade і лише в цей момент емітимо подію connection
    req.userId = userId
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req)
    })
})

wss.on("connection", (ws, req) => {
    const { userId } = req //? при виникненні події ми вже маємо userId

    clients.set(userId, ws) //? зв'язуємо поточний відкритий ws з клієнтом

    //? якщо ws відключився - від'язуємо його від користувача
    ws.on("close", () => {
        clients.delete(userId)
    })

    ws.on("message", (message) => {
        let data
        try {
            data = JSON.parse(message)
        } catch (error) {
            return
        }

        if (data.type === "chat_message") {
            const user = DB.users.find((u) => u.id === userId)
            const fullMessage = JSON.stringify({
                type: "chat_message",
                message: data.message,
                name: user.username,
            })
            //? відправляємо значення усім підписаним на сокет користувачам
            for (ws of clients.values()) {
                ws.send(fullMessage)
            }
        }
    })
})

server.listen(process.env.PORT, () =>
    console.log(` Server running on http://localhost:${process.env.PORT}`)
)
