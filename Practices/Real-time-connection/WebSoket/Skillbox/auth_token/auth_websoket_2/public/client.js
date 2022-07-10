/* eslint-env browser */

//? одразу створюємо ws з'єднання, тому що пункт контролю лише в місці де опрацьовуємо отримані повідомлення
const wsProto = location.protocol === "https:" ? "wss:" : "ws:"
const client = new WebSocket(`${wsProto}//${location.host}`)
let token = null

const newMessagesContainer = document.getElementById("new-message-container")
const loginContainer = document.getElementById("login")
const chatContainer = document.getElementById("chat")
const newMessage = document.getElementById("new-message")

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

    chatContainer.appendChild(cEl)
    chatContainer.scrollTop = chatContainer.scrollHeight //? щоб нові повідомлення були помітні проскролюємо в самий низ
}

const postMessage = (message) => {
    //? надсилаємо дані на сервер
    client.send(
        JSON.stringify({
            type: "chat_message",
            token,
            message,
        })
    )
}

newMessage.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const value = (newMessage.value || "").trim()
        if (value) {
            postMessage(value)
            newMessage.value = ""
        }
    }
})

loginContainer.addEventListener("submit", (event) => {
    event.preventDefault()

    const username = loginContainer.querySelector(".username").value
    const password = loginContainer.querySelector(".password").value

    client.send(JSON.stringify({ type: "login", username, password })) //? так як взаємодія із сокетами це асинхронна подія, то всі взаємодії із клієнтом на основі відповіді - ми робимо в прослуховувачі подій message
})

client.addEventListener("message", (message) => {
    let data
    try {
        data = JSON.parse(message.data)
    } catch (error) {
        return
    }
    //? реалізовуємо логіку відносно відповіді від сервера
    if (data.type === "auth_error") {
        alert(data.error)
    } else if (data.type === "auth_success") {
        token = data.token //? глобально ініціалізуємо токен
        loginContainer.style.display = "none"
        chatContainer.style.display = "block"
        newMessagesContainer.style.display = "block"
    } else if (data.type === "chat_message_error") {
        alert(data.error)
    } else if (data.type === "chat_message") {
        addMessage(data)
    }
})
