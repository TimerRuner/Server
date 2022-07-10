const EventEmitter = require("events")
const emitter = new EventEmitter()

/** Вигляд об'єкта маршрутизації
 * endpoints = {
 *  '/users': {
 *      'GET': handler1,
 *      'POST': handler2,
 *      'DELETE': handler3
 *  }
 * }
 */

module.exports = class Router {
    constructor() {
        this.endpoints = {}
    }

    request(method = "GET", path, handler) {
        //? якщо даного маршруту, ще немає, створюємо під ньоо об'єкт
        if (!this.endpoints[path]) {
            this.endpoints[path] = {}
        }
        //? /users [GET, POST, PUT] /posts [GET, POST, PUT, DELETE]
        const endpoint = this.endpoints[path]
        //? перевірка на наявність метода і обробника по даному методу в даному шляху
        if (endpoint[method]) {
            throw new Error(`[${method}] по адресу ${path} уже існує`)
        }

        endpoint[method] = handler
    }

    get(path, handler) {
        this.request("GET", path, handler)
    }
    post(path, handler) {
        this.request("POST", path, handler)
    }
    put(path, handler) {
        this.request("PUT", path, handler)
    }
    delete(path, handler) {
        this.request("DELETE", path, handler)
    }
}
