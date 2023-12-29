import React, { useContext, useState} from 'react'

export const UserContext = React.createContext([])

export const useUserContext = () => useContext(UserContext)

const UserProvider = ({ children, defaultSession }) => {

    const [username, setUsername] = useState(defaultSession.username)

    const [isLogged, setIsLogged] = useState(defaultSession.isLogged)

    return <UserContext.Provider value={{ username, isLogged, setIsLogged, setUsername }}>

        {children}

    </UserContext.Provider>
}

export default UserProvider