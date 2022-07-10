/* eslint-env browser */
let client = null //? клієнт ініціалізовується лише після отримання токену авторизації

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

    fetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                return response.text().then((err) => {
                    throw new Error(err)
                })
            }
        }) //! зміни
        .then(() => {
            const wsProto = location.protocol === "https:" ? "wss:" : "ws:"
            client = new WebSocket(`${wsProto}//${location.host}`)
            loginContainer.style.display = "none"

            //? як тільки сокет готовий до роботи - відображаємо все необхідне
            client.addEventListener("open", () => {
                chatContainer.style.display = "block"
                newMessagesContainer.style.display = "block"
            })

            //? коли із сервера приходять дані ми їх опрацьовуємо
            client.addEventListener("message", (message) => {
                let data
                try {
                    data = JSON.parse(message.data)
                } catch (error) {
                    return
                }
                if (data.type === "chat_message") {
                    addMessage(data)
                }
            })
        })
        .catch((err) => {
            alert(err.message)
        })
})
