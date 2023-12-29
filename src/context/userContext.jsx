import React, { useContext, useState, useEffect } from 'react'
import { fetchAPI } from '../utils'

export const UserContext = React.createContext([])

export const useUserContext = () => useContext(UserContext)

const UserProvider = ({ children }) => {

    const [username, setUsername] = useState("")

    const [isLogged, setIsLogged] = useState(false)

    return <UserContext.Provider value={{ username, isLogged, setIsLogged, setUsername }}>

        {children}

    </UserContext.Provider>
}

export default UserProvider