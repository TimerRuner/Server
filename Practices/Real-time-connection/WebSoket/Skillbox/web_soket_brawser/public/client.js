/* eslint-env browser */

const wsProto = location.protocol === "https:" ? "wss:" : "ws:"
const client = new WebSocket(`${wsProto}//${location.host}`)

const messagesContainer = document.getElementById("chat")
const addMessage = ({ name, message }) => {
    const cEl = document.createElement("p")

    const nEl = document.createElement("span")
    nEl.className = "name"
    nEl.innerText = name
    cEl.appendChild(nEl)

    const mEl = document.createElement("span")
    mEl.className = "message"
    mEl.innerText = message
    cEl.appendChild(mEl)

    messagesContainer.appendChild(cEl)
    messagesContainer.scrollTop = messagesContainer.scrollHeight //? щоб нові повідомлення були помітні проскролюємо в самий низ
}

//? ловимо надхлдження повідомлень з сервера через браузерний апі
client.addEventListener("message", (message) => {
    let data
    try {
        data = JSON.parse(message.data) //? так як дані були в викляді json, то ми його парсимо
    } catch (error) {
        return
    }

    if (data.type === "chat_message") {
        addMessage(data)
    }
})

const portMessage = () => {
    const message = "Message" + Math.random().toString()
    const name = "User" + Math.random().toString() //? генерує рандомний нікнейм

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
client.addEventListener("open", portMessage)
