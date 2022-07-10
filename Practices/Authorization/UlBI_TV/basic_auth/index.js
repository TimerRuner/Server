const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./authRouter")

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://vadimas:root1234@cluster0.bxk0wpf.mongodb.net/?retryWrites=true&w=majority`
        )
        app.listen(PORT, () =>
            console.log(` Server started http://localhost:${PORT}`)
        )
    } catch (error) {
        console.log(error)
    }
}

start()
