//! Події в node.js

const Emitter = require("events")
const emitter = new Emitter()

//? створення події і закріплення колбека, за даноюподією
const callback = (data, second, third) => {
    console.log("you sent message " + data)
    console.log("you sent second message " + second)
    console.log("you sent third message " + third)
}
emitter.on("message", callback)

const MESSAGE = process.env.MESSAGE || "some text"

if (MESSAGE) {
    //? виклик події
    emitter.emit("message", MESSAGE, 123)
} else {
    emitter.emit("message", "You didn't set message")
}

//** =============================== others ================================ */
emitter.once("new", (str) => console.log(str))
emitter.emit("new", 123)
emitter.emit("new", 123)
emitter.emit("new", 123)

//** ============================= видалення подій =============================*/
emitter.removeAllListeners()
emitter.removeListener("message", callback) //? видалення конкретного колбека
