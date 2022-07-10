//! Рота із потоками даних
//? Стрім - це потік даних, необхідний дани функціонал для того, щоб читати чи записувати великі файли порційно, розмір 1 куска 64kb, це може бути і передача, скачування чогось в мережі, все що можна передавати чи зчитувати по кускам, це не обов'язково повинні бути файли

//? Readable - читання
//? Writable - запис
//? Duplex - для читання і запису Readable + Writable
//? Transform - Такий, як duplex, але може змінити дані в процесі читання

const fs = require("fs")
const path = require("path")

//? звичний спосіб
// fs.readFile(path.resolve(__dirname, "test.txt"), (err, data) => {
//     if (err) {
//         throw err
//     }
//     console.log(data)
// })

//** ========================= використання stream Readable ========================== */
// const stream = fs.createReadStream(path.resolve(__dirname, "test.txt"))
// //? безпосереднє читання
// stream.on("data", (chunk) => {
//     console.log(chunk)
// })

// stream.on("end", () => console.log("Finished read"))
// stream.on("open", () => console.log("Start read"))
// stream.on("error", (err) => console.log(err))

//** ========================= використання stream Writable ========================== */
const writableStream = fs.createWriteStream(
    path.resolve(__dirname, "test2.txt")
)
for (let i = 0; i < 20; i++) {
    writableStream.write(i + "\n")
}
//? закриття стріма
writableStream.end()
// writableStream.close()
// writableStream.destroy()

//** ========================= readable/writable streams ========================== */
const http = require("http")

http.createServer((req, res) => {
    //?req - readable stream
    //?res - writable stream
    const stream = fs.createReadStream(path.resolve(__dirname, "test.txt"))

    stream.pipe(res) //readable stream не починає читати нову порцію даних, доки writable не закінчив запис попередньої
})
