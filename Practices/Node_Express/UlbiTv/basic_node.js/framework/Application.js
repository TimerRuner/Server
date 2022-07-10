const http = require("http")
const EventEmitter = require("events")

module.exports = class Application {
    constructor() {
        this.emitter = new EventEmitter()
        this.server = this._createServer()
        this.middleware = [] //? масив фукнцій, які ми по ланцюгу викликаємо перед кожним запитом
    }

    listen(port, cb) {
        this.server.listen(port, cb)
    }

    use(middleware) {
        this.middleware.push(middleware)
    }

    //? на основі router ми ініцілізуємо всі необхідні події
    addRouter(router) {
        Object.keys(router.endpoints).forEach((path) => {
            const endpoint = router.endpoints[path]
            Object.keys(endpoint).forEach((method) => {
                this.emitter.on(
                    this._getRouteMask(path, method),
                    (req, res) => {
                        const handler = endpoint[method]
                        handler(req, res)
                    }
                )
            })
        })
    }

    _createServer() {
        return http.createServer((req, res) => {
            //? req - це readable stream, тому для опрацювання post запитів, нам потрібно зчитувати дані надіслані на серевер
            let body = "" //? так як дані можуть бути великі, створ. змінну для запису по кускам
            req.on("data", (chunk) => {
                body += chunk
            })
            req.on("end", () => {
                if (body) {
                    req.body = JSON.parse(body)
                }
                this.middleware.forEach((middleware) => middleware(req, res)) //? викликаємо тут мідлвари, щоб pathname уже нам був доступний
                //? коли ми емітимо подію, якої неіснує, метод повертає false, так ми можемо опрацювати неіснуючі методи

                const emitted = this.emitter.emit(
                    this._getRouteMask(req.pathname, req.method),
                    req,
                    res
                )

                if (!emitted) {
                    res.end()
                }
            })
        })
    }

    //? маска: [/users]:[GET]
    _getRouteMask(path, method) {
        return `[${path}]:[${method}]`
    }
}
