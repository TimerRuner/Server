import $api from "../http"
import { AxiosResponse } from "axios"
import { IUser } from "../models/IUser"

//! бізнес логіка для роботи із сервером
export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>("/users")
    }
}
