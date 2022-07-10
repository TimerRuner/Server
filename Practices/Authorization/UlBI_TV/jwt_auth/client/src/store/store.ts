import { makeAutoObservable } from "mobx"
import { IUser } from "../models/IUser"
import AuthService from "../services/AuthService"
import axios from "axios"
import { AuthResponse } from "../models/models/AuthResponse"
import { API_URL } from "../http"

export default class Store {
    user = {} as IUser
    isAuth = false
    isLoading = false

    constructor() {
        makeAutoObservable(this) //? передаємо клас в mobx
    }

    //? мутації
    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUser(user: IUser) {
        this.user = user
    }

    setLoading(bool: boolean) {
        this.isLoading = bool
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password)
            console.log(response)
            //? при упішному запиті, в відповідь потраплять токени
            localStorage.setItem("token", response.data.accessToken)
            //? якщо логін відбувся успішно, то додаємо юзера і статус авторизовано в наш клас
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password)
            console.log(response)
            //? при упішному запиті, в відповідь потраплять токени
            localStorage.setItem("token", response.data.accessToken)
            //? якщо логін відбувся успішно, то додаємо юзера і статус авторизовано в наш клас
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            //? при упішному запиті, в відповідь потраплять токени
            localStorage.removeItem("token")
            //? якщо логін відбувся успішно, то додаємо юзера і статус авторизовано в наш клас
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }

    async checkAuth() {
        this.setLoading(true)
        try {
            const response = await axios.get<AuthResponse>(
                `${API_URL}/refresh`,
                { withCredentials: true }
            )
            console.log(response)
            localStorage.setItem("token", response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error.response?.data?.message)
        } finally {
            this.setLoading(false)
        }
    }
}
