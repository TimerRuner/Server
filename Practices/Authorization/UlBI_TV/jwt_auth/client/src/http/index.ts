//! модуль для роботи із axios і запитами на сервер
import axios from "axios"
import { AuthResponse } from "../models/models/AuthResponse"

export const API_URL = `http://localhost:5000/api`

//? інтенс axios
const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

//? інтерсептор для автоматичного задання header authorization з нашим токеном для перевірки прав доступу
$api.interceptors.request.use((config) => {
    //? тепер до кожного запиту в нас буде чіплятись токен по вказаному заголовку
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
})

//? інтерсептор для перезапису accessToken завдяки refreshToken, якщо accessToken помер
$api.interceptors.response.use(
    (config) => {
        return config
    },
    async (error) => {
        const originalRequest = error.config
        if (
            (error.response.status =
                401 && error.config && !error.config._isRetry)
        ) {
            originalRequest._isRetry = true //? щоб уникнути зациклиння запитів
            try {
                const response = await axios.get<AuthResponse>(
                    `${API_URL}/refresh`,
                    { withCredentials: true }
                )
                localStorage.setItem("token", response.data.accessToken)
                //? повторяємо запит на отримання користувача, щоб самому юзеру не доводилось щось робити
                return $api.request(originalRequest)
            } catch (error) {
                console.log("Not Authorization")
            }
        }
        throw error //? якщо прилітає помилка в якої не 401 код
    }
)

export default $api
