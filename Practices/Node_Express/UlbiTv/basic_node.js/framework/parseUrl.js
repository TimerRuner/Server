//? baseUrl - http://localhost:5000

module.exports = (baseUrl) => (req, res) => {
    const parsedUrl = new URL(req.url, baseUrl)
    const params = {}

    parsedUrl.searchParams.forEach((val, key) => (params[key] = val)) //? переносимо query params в окремий об'єкт

    //? модифікуємо об'єкт req власними конфігураційними полями
    req.pathname = parsedUrl.pathname //?  http://localhost:5000
    req.params = params
}
