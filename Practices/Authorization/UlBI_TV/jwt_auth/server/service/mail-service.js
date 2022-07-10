//! бізнес логіка для роботи із поштою - відправка повідомлення із активацією
const nodemailer = require("nodemailer")

class MailService {
    //? ініціалізовуємо поштовий клієнт
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWROD,
            },
        })
    }
    //? метод для відправки листа із підтвердженням пошти
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Activation account on " + process.env.API_URL,
            text: "",
            html: `
                <div>
                    <h1>Click button for actionvation account</h1>
                    <a href=${link}>${link}</a>
                </div>
            `,
        })
    }
}

module.exports = new MailService()
