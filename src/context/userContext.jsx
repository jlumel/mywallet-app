import React, { useContext, useEffect, useState } from 'react'
import { updateData } from '../utils'

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
    const [subcategoryFilter, setSubcategoryFilter] = useState({ active: false, param: { key: "subcategoryName", value: "" } })
    const [minDateFilter, setMinDateFilter] = useState({ active: false, param: { key: "minDate", value: "" } })
    const [maxDateFilter, setMaxDateFilter] = useState({ active: false, param: { key: "maxDate", value: "" } })

    useEffect(() => {
        if (isLogged) {
            updateData({ setTransactions, setCurrencies, setCategories, setSubcategories }, token)
        }
    }, [isLogged])

    return (
        <UserContext.Provider value={{
            username,
            isLogged,
            token,
            transactions,
            accounts,
            currencies,
            categories,
            subcategories,
            query,
            accountFilter,
            currencyFilter,
            categoryFilter,
            subcategoryFilter,
            minDateFilter,
            maxDateFilter,
            setIsLogged,
            setUsername,
            setToken,
            setTransactions,
            setAccounts,
            setCurrencies,
            setCategories,
            setSubcategories,
            setQuery,
            setAccountFilter,
            setCurrencyFilter,
            setCategoryFilter,
            setSubcategoryFilter,
            setMinDateFilter,
            setMaxDateFilter
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
