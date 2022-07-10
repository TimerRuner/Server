import $api from "../http"
import { AxiosResponse } from "axios"
import { AuthResponse } from "../models/models/AuthResponse"

//! бізнес логіка для роботи із сервером
export default class AuthService {
    static async login(
        email: string,
        password: string
    ): Promise<AxiosResponse<AuthResponse>> {
        //? типізовуємо дані прийдені в response
        //? відправляємо запит з уже налагтованого конфіга axios
        return $api.post<AuthResponse>("/login", { email, password })
    }

    static async registration(
        email: string,
        password: string
    ): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/registration", { email, password })
    }

    static async logout(): Promise<void> {
        return $api.post("/logout")
    }
}
