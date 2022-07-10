//! типізація об'єкта user, що приходить у відповідь з сервера
export interface IUser {
    email: string
    isActivated: boolean
    id: string
}
