//! бізнес логіка нашого додатку відносно юзера
const UserModel = require("../models/user-model")
const bcrypt = require("bcrypt")
const mailService = require("./mail-service")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

class UserService {
    async registration(email, password) {
        //? перевірка на наявність користувача в бд
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            // throw new Error(`User with email ${email} already exist`)
            //? для прокидування наших кастомних помилок
            throw ApiError.BadRequest(`User with email ${email} already exist`)
        }

        //!хешування паролю перед записом в базу
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = (Math.random() * new Date()).toString(16) //? унікальне значення, по якому буде здійснюватись перевірка на підтвердження пошти
        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
        })

        //! надсилання підтвердження на пошту
        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/activate/${activationLink}` //? користувачу відправляємо посилання на заготовлений end point
        )

        //! Генеруємо пару токенів
        //? фільтруємо модель повертаєчи лише об'єкт із потрібними полями, не враховуючи password
        const userDto = new UserDto(user) //** id, email, isActivated */
        const tokens = tokenService.generateTokens({ ...userDto }) //? передаємо в функцію лише об'єкт із необхідними даними
        //? зберігаємо токен конкретного юзера в db
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }

    //? по даному унікальному значенню шукаємо користувача в бд, щоб підтвердити підтвердження пошти
    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest("Uncorrect activation link")
        }
        //? якщо користувач таки є в бд
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        //? якщо такого користувача немає, серез зареєстрованих, прокидуємо помилку
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest("User didn't find")
        }
        //!Якщо користувач був знайдений, то ми порівнюємо його пароль із хешованим поточним
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest("Wrong password")
        }
        //! Генеруємо пару токенів
        //? фільтруємо модель повертаєчи лише об'єкт із потрібними полями, не враховуючи password
        const userDto = new UserDto(user) //** id, email, isActivated */
        const tokens = tokenService.generateTokens({ ...userDto }) //? передаємо в функцію лише об'єкт із необхідними даними
        //? зберігаємо токен конкретного юзера в db
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError() //? якщо токена немає, то власне користувач в такому випадку не авторизований
        }
        //? перевірка на свіжість і не підробність
        const userData = tokenService.validateRefreshToken(refreshToken)
        //? знаходимо токен в бд
        const tokenFromDb = await tokenService.findToken(refreshToken)
        //? якщо токен не валідний чи відсутній в бд - користувач не зареєстрований
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        //! Генеруємо нову пару токенів
        const user = await UserModel.findById(userData.id) //? знаходимо користувача, так як за певний час його інформація могла змінитись
        //? фільтруємо модель повертаєчи лише об'єкт із потрібними полями, не враховуючи password
        const userDto = new UserDto(user) //** id, email, isActivated */
        const tokens = tokenService.generateTokens({ ...userDto }) //? передаємо в функцію лише об'єкт із необхідними даними
        //? зберігаємо токен конкретного юзера в db
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()
