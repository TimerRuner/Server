import { IUser } from "../IUser"

//! типізація нашого response.data, який прийде у відповідь з axios
export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
}
