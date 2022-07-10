const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false }, //? підтверджена користувачем пошта чи ні
    activationLink: { type: String }, //? зберігатимемо посилання на активацію
})

module.exports = model("User", UserSchema)
