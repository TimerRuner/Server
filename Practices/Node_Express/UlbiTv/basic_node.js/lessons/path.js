//! модуль для роботи із шляхами
//! __dirname - строка, що містить абсолютний шлях до поточної деректорії
//! __filename - строка, що
const path = require("path")

//** ================================= path.join() ===================================== */
//? join - повертає склеєну строку з переданих параметрів, в вигляді шляху із розмежовувачами, в залежності від ОС, можемо повертатись в деректорії назад, завдяки '..'

path.join("first", "second") //? first/second || first\second - залежить від ОС

//** ================================= path.resolve() ===================================== */
//? Працює, як path.join(), але завжди повертає абсолютний шлях
//? Особливості - при передачі слеша в одному із параметрів ми отримаємо шлях відносно даної деректорії
path.resolve("first", "second") //*V:\MyProfecion\Server\Practices\UlbiTv\basic_node.js\first\second
path.resolve("/first", "second") //*V:\first\second

//** ================================= path.parse() ===================================== */
//? Даний метод парситьшлях на об'єкт із конкретними елементами шляху
const fullpath = path.resolve("first", "second")
console.log(path.parse(fullpath))

//** =============================== others ========================================== */
console.log("Розділителі в OS", path.sep)
console.log("Провірка на абсолютний шлях", path.isAbsolute("first/second"))
console.log("Назва файлу", path.basename(fullpath))
console.log("Розширення файлу", path.extname(fullpath))

//** ======================================= parse URL ===============*/
const siteURL = "http://localhost:8080/users?id=5123"

const url = new URL(siteURL) //? парсиль нам url в об'єкт із конкретними параметрами
console.log(url)
