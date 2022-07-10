//!Модуль для роботи із файлами
const fs = require("fs")
const path = require("path")

//** ===================== Створення папки =========================================*/
//? Спрацює лише, якщо папки такої немає, якщо є - викине помилку

//? Синхронна версія
//? Для створення вложеності папок, передамо параметри {recursive:true}
// fs.mkdirSync(path.resolve(__dirname, "dir", "dir2", "dir3"), {
//     recursive: true,
// })

//? Асинхронна версія
// fs.mkdir(path.resolve(__dirname, "dir"), (err) => {
//     if (err) {
//         console.log(err)
//         return //? Щоб при виникненні помилки не робити витік пам'яті
//     }
// })

//** ===================== Видалення папки =========================================*/

// fs.rmdir(path.resolve(__dirname, "dir"), (err) => {
//     if (err) {
//         throw err
//     }
// })

//** ===================== Створення файлу =========================================*/
//? фукнція лише записує дані, тому, якщо вони в файлі вже є - дані перезатираються
// fs.writeFile(
//     path.resolve(__dirname, "test.txt"),
//     "5 qwertu 7 23sd 234",
//     (err) => {
//         if (err) {
//             throw err
//         }
//         console.log("file made")
//     }
// )

//** ===================== Дозапис файлу =========================================*/
// fs.appendFile(path.resolve(__dirname, "test.txt"), " new string", (err) => {
//     if (err) {
//         throw err
//     }
//     console.log("file made")
// })

//** ================================ Особливості роботи ================================= */
//? Так як ми працюємо із асинхронними функціями, то краще створювати вложеності функції, для послідовності виконання, але такий підхід застарілий
// fs.writeFile(
//     path.resolve(__dirname, "test.txt"),
//     "5 qwertu 7 23sd 234",
//     (err) => {
//         if (err) {
//             throw err
//         }
//         fs.appendFile(
//             path.resolve(__dirname, "test.txt"),
//             " new string",
//             (err) => {
//                 if (err) {
//                     throw err
//                 }
//                 console.log("file made")
//             }
//         )
//     }
// )
//? Використовується підхід на промісах
const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) =>
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err.message)
            resolve()
        })
    )
}

const appendFileAsync = async (path, data) => {
    return new Promise((resolve, reject) =>
        fs.appendFile(path, data, (err) => {
            if (err) return reject(err.message)
            resolve()
        })
    )
}

//? По замовчуванню дані зчитуються в буфер, тому для отримання чистих даних - використовуємо encoding: utf-8
const readFileAsync = async (path) => {
    return new Promise((resolve, reject) =>
        fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
            if (err) return reject(err.message)
            resolve(data)
        })
    )
}

//? rm - видаляє файли, rmdir - видаляє папки
const removeFileAsync = async (path) => {
    return new Promise((resolve, reject) =>
        fs.rm(path, (err) => {
            if (err) return reject(err.message)
            resolve()
        })
    )
}
const localPath = path.resolve(__dirname, "test.txt")
// writeFileAsync(localPath, "data")
//     .then(() => appendFileAsync(localPath, " 123"))
//     .then(() => appendFileAsync(localPath, " 345"))
//     .then(() => appendFileAsync(localPath, " 995"))
//     .then(() => readFileAsync(localPath))
//     .then((data) => console.log(data))
//     .then(() => removeFileAsync(localPath))
//     .catch((err) => console.log(err))

//** =============================== Homework ========================================== */
const dotenv = require("dotenv")
dotenv.config()

const str = process.env.HOME_STRING || ""
const homepath = path.resolve(__dirname, "homework.txt")

const writeFileAs = async (path, data) => {
    return new Promise((res, rej) => {
        fs.writeFile(path, data, (err) => {
            if (err) rej(err)
            res()
        })
    })
}
const readFileAs = async (path) => {
    return new Promise((res, rej) => {
        fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
            if (err) rej(err)
            res(data)
        })
    })
}
const delFileAs = async (path) => {
    return new Promise((res, rej) => {
        fs.rm(path, (err) => {
            if (err) rej(err)
            res()
        })
    })
}

writeFileAs(homepath, str)
    .then(() => readFileAs(homepath))
    .then((data) => data.split(" ").length.toString())
    .then((data) => writeFileAs(path.resolve(__dirname, "count.txt"), data))
    .then(() => delFileAs(homepath))
    .catch((err) => console.log(err))
