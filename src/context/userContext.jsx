import React, { useContext, useState} from 'react'

export const UserContext = React.createContext([])

export const useUserContext = () => useContext(UserContext)

const UserProvider = ({ children }) => {

    const [username, setUsername] = useState("")

    const [isLogged, setIsLogged] = useState(false)

    const [token, setToken] = useState(null)

    const [transactions, setTransactions] = useState([])

    return <UserContext.Provider value={{ username, isLogged, token, transactions, setIsLogged, setUsername, setToken, setTransactions }}>

        {children}

    </UserContext.Provider>
}

export default UserProvider