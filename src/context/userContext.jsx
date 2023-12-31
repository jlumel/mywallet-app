import React, { useContext, useEffect, useState } from 'react'
import { updateSession, updateData } from '../utils'

export const UserContext = React.createContext([])

export const useUserContext = () => useContext(UserContext)

const UserProvider = ({ children }) => {

    const [username, setUsername] = useState("")

    const [isLogged, setIsLogged] = useState(false)

    const [transactions, setTransactions] = useState([])

    const [accounts, setAccounts] = useState([])

    const [currencies, setCurrencies] = useState([])

    const [categories, setCategories] = useState([])

    const [subcategories, setSubcategories] = useState([])

    useEffect(() => {
        updateSession(setIsLogged, setUsername)
        updateData(setTransactions, setAccounts, setCurrencies, setCategories, setSubcategories)

    }, [])

    return <UserContext.Provider value={{ username, isLogged, transactions,accounts, currencies, categories, subcategories, setIsLogged, setUsername, setTransactions, setAccounts, setCurrencies, setCategories, setSubcategories }}>

        {children}

    </UserContext.Provider>
}

export default UserProvider