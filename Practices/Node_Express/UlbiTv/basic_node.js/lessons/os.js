//! Модуль для роботи із операційною системою
const os = require("os")
const cluster = require("cluster")

// console.log("Platform", os.platform())
// console.log("Архітектура процесора", os.arch())
// console.log("Масив ядер із характеристиками", os.cpus().length)

//? запуск процесів в залежності від к-сті ядер, проте необхідно залишити 1-2 ядра для роти віндовс
const cpus = os.cpus()

//? якщо процес є головним для кожного ядра запускаємо процес
if (cluster.isMaster) {
    for (let i = 0; i < cpus.length - 2; i++) {
        cluster.fork() //? запуск дочірніх процесів
    }
    //? якщо якийсь із процесів помирає створюємо новий
    cluster.on("exit", (worker) => {
        console.log(`worker with pid= ${worker.process.pid} dead`)
        cluster.fork()
    })
} else {
    //? спрацює при запуску дочірніх процесів
    console.log(`Worker with pid= ${process.pid} started`)
    setInterval(() => {
        console.log(`Worker with pid= ${process.pid} still working`)
    }, 5000)
}
