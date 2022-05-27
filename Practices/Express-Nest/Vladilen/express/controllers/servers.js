//! Контроллер описує відповідь від даного сервера

let servers = [
    { id: "1", name: "Aws", status: "working" },
    { id: "2", name: "Google cloud", status: "working" },
    { id: "3", name: "Yandex cloud", status: "working" },
    { id: "4", name: "Microsoft", status: "pending" },
]

export const getAll = (req, res) => {
    res.status(200).json(servers)
}

export const create = (req, res) => {
    //? На основі даних отриманих із фронта ми формуємо новий об'єкт
    const newServer = {
        id: Date.now().toString(),
        ...req.body,
    }

    servers.push(newServer)
    //? повертаємо на клієнт відповідь в вигляді нашого об'єкта
    res.status(201).json(newServer)
}

export const remove = (req, res) => {
    console.log("ID", req.params.id)
    servers.servers.filter((s) => s.id !== req.params.id)
    res.json({})
}
