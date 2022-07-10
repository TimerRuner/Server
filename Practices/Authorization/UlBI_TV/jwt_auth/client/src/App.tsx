import React, { FC, useContext, useEffect, useState } from "react"
import { Context } from "./index"
import { observer } from "mobx-react-lite"
import LonginForm from "./components/LonginForm"
import { IUser } from "./models/IUser"
import UserService from "./services/UserService"

const App: FC = () => {
    const { store } = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (localStorage.getItem("token")) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    if (store.isLoading) {
        return <div>Loading ....</div>
    }

    if (!store.isAuth) {
        return <LonginForm />
    }

    return (
        <div>
            <h1>
                {store.isAuth
                    ? `User is authorized ${store.user.email}`
                    : "AUTHORIZING"}
            </h1>
            <h1>
                {store.user.isActivated
                    ? `Account is verified`
                    : "Please verify your account"}
            </h1>
            <button onClick={() => store.logout()}>Exit</button>
            <div>
                <button onClick={getUsers}>Get users</button>
            </div>
            {users.map((user) => (
                <div key={user.email}>{user.email}</div>
            ))}
        </div>
    )
}

export default observer(App)
