import axios from "axios";

export const fetchAPI = async (method, url, body) => {

  const instance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
  })

  try {
    const response = await instance[method](url, body)
    return response.data
  } catch (error) {
    return null
  }
}

export const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)

export const updateSession = async (setIsLogged, setUsername) => {

  try {

    const response = await fetchAPI('post', '/api/user', null)
    setIsLogged(true)
    setUsername(response.username)
    return Promise.resolve()

  } catch (error) {
    setIsLogged(false)
    setUsername("")
    return Promise.reject()

  }
}

export const updateData = async (setTransactions, setAccounts, setCurrencies, setCategories, setSubcategories) => {

  try {
    if (setTransactions) {
      const transactions = await fetchAPI('get', '/api/transactions', null)
      setTransactions(transactions)
    }
    if (setAccounts) {
      const accounts = await fetchAPI('get', '/api/accounts', null)
      setAccounts(accounts)
    }
    if (setCurrencies) {
      const currencies = await fetchAPI('get', '/api/currencies', null)
      setCurrencies(currencies)
    }
    if (setCategories) {
      const categories = await fetchAPI('get', '/api/categories', null)
      setCategories(categories)
    }
    if (setSubcategories) {

      const subcategories = await fetchAPI('get', '/api/subcategories', null)
      setSubcategories(subcategories)
    }
  } catch (err) {
    return err
  }

}