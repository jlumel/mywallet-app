import axios from "axios";

export const fetchAPI = async (method, url, body) => {

  const instance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
  })

  try {
    const response = await instance[method](url, body)
    return response
  } catch (error) {
    return error
  }
}

export const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)

export const updateSession = async (setIsLogged, setUsername) => {

  try {

    const response = await fetchAPI('get', '/api/user', null)
    setIsLogged(true)
    setUsername(response.data.username)
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
      const response = await fetchAPI('get', '/api/transactions', null)
      setTransactions(response.data)
    }
    if (setAccounts) {
      const response = await fetchAPI('get', '/api/accounts', null)
      setAccounts(response.data)
    }
    if (setCurrencies) {
      const response = await fetchAPI('get', '/api/currencies', null)
      setCurrencies(response.data)
    }
    if (setCategories) {
      const response = await fetchAPI('get', '/api/categories', null)
      setCategories(response.data)
    }
    if (setSubcategories) {

      const response = await fetchAPI('get', '/api/subcategories', null)
      setSubcategories(response.data)
    }
  } catch (err) {
    return err
  }

}