import React, { useContext, useEffect, useState } from 'react'
import { updateSession, updateData } from '../utils'

export const UserContext = React.createContext([])

export const useUserContext = () => useContext(UserContext)

const UserProvider = ({ children, defaultToken }) => {

    const [username, setUsername] = useState("")

    const [isLogged, setIsLogged] = useState(false)

    const [token, setToken] = useState(defaultToken)

    const [transactions, setTransactions] = useState([])

    const [accounts, setAccounts] = useState([])

    const [currencies, setCurrencies] = useState([])

    const [categories, setCategories] = useState([])

    const [subcategories, setSubcategories] = useState([])

    const [query, setQuery] = useState([])

    const [accountFilter, setAccountFilter] = useState({ active: false, param: { key: "accountName", value: "" } })
    const [currencyFilter, setCurrencyFilter] = useState({ active: false, param: { key: "currencyAcronym", value: "" } })
    const [categoryFilter, setCategoryFilter] = useState({ active: false, param: { key: "categoryName", value: "" } })

    useEffect(() => {
        updateSession(setIsLogged, setUsername, token, setToken)
    }, [])

    useEffect(() => {
        isLogged && updateData({ setTransactions, setAccounts, setCurrencies, setCategories, setSubcategories }, token)
    }, [isLogged])

    return <UserContext.Provider value={{ 
        username, isLogged, token, transactions, accounts, currencies, categories, subcategories, query, accountFilter, currencyFilter, categoryFilter, setIsLogged, setUsername, setToken, setTransactions, setAccounts, setCurrencies, setCategories, setSubcategories, setQuery, setAccountFilter, setCurrencyFilter, setCategoryFilter}}>

        {children}

    </UserContext.Provider>
}

export default UserProvider