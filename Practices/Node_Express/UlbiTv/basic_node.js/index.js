const Aplication = require("./framework/Application")
const userRouter = require("./src/user-router")
const jsonParser = require("./framework/parseJson")
const parseUrl = require("./framework/parseUrl")
const PORT = process.env.PORT || 5000
const mongoose = require("mongoose")

const app = new Aplication()

app.use(jsonParser)
app.use(parseUrl("http://localhost:5000"))
app.addRouter(userRouter)

const start = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://vadimas:root1234@cluster0.wbep6eg.mongodb.net/?retryWrites=true&w=majority"
        )
        app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()
