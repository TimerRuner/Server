require("dotenv").config()
const { faker } = require("@faker-js/faker")

const WebSoket = require("ws")
const client = new WebSoket(`ws://localhost:${process.env.PORT}`)

const name = faker.internet.userName() //? генерує рандомний нікнейм

//? ловимо надхлдження повідомлень з сервера
client.on("message", (data) => {
    try {
        data = JSON.parse(data) //? так як дані були в викляді json, то ми його парсимо
    } catch (error) {
        return
    }

    if (data.type === "chat_message") {
        console.log(`${data.name}: ${data.message}`)
    }
})

const portMessage = () => {
    const message = faker.lorem.sentence()

    //? надсилаємо дані на сервер
    client.send(
        JSON.stringify({
            type: "chat_message",
            name,
            message,
        })
    )

    setTimeout(portMessage, 2000 + (Math.random() - 0.5) * 200)
}

//? надсилаємо повідомлення лише коли клієнт буде готовий, тобто з'єднання із сервером знову відкрите
client.on("open", portMessage)
