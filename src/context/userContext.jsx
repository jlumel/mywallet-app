import React, { useContext, useEffect, useState } from 'react'
import { updateSession } from '../utils'

export const UserContext = React.createContext([])

export const useUserContext = () => useContext(UserContext)

const UserProvider = ({ children }) => {

    const [username, setUsername] = useState("")

    const [isLogged, setIsLogged] = useState(false)

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        updateSession(setIsLogged, setUsername)
    }, [])

    return <UserContext.Provider value={{ username, isLogged, transactions, setIsLogged, setUsername, setTransactions }}>

        {children}

    </UserContext.Provider>
}

export default UserProvider