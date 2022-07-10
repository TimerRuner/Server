const http = require("http")

const PORT = process.env.PORT || 5000

const server = http.createServer((req, res) => {
    // //? заголовки для роботи із керилицею
    // res.writeHead(200, { "Content-type": "text/html; charset=utf-8" })
    // //? закриваємо stream і повертаємо дані користувачеві
    // res.end("<h1>Hello World</h1>")

    //? кастомна маршрутизація
    res.writeHead(200, {
        "Content-type": "application/json",
    })
    if (req.url === "/users") {
        return res.end(JSON.stringify([{ id: 1, name: "ULBI TV" }]))
    }
    res.end(req.url)
})

//? для прослуховуванням сервером вхідні з'єднання
server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
