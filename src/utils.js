import axios from "axios"

export const fetchAPI = async (method, url, body, token) => {

  const instance = axios.create({
    baseURL: import.meta.env.VITE_DEV_ENVIRONMENT == "true" ? 'http://localhost:8080' : 'https://mywalletapi.lumel.dev',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    withCredentials: true
  })

  try {
    const response = await instance[method](url, body, token)
    return response
  } catch (error) {
    return error
  }
}

export const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)

export const updateSession = async (setIsLogged, setUsername, token, setToken) => {

  try {

    const response = await fetchAPI('get', '/api/user', null, token)
    setIsLogged(true)
    setUsername(response.data.username)
    return Promise.resolve()

  } catch (error) {
    setIsLogged(false)
    setUsername("")
    setToken("")
    localStorage.clear()
    return Promise.reject()

  }
}

export const updateData = async (setters, token) => {

  try {
    if (setters.setTransactions) {
      const response = await fetchAPI('get', '/api/transactions', null, token)
      setters.setTransactions((response.data).reverse())
    }
    if (setters.setAccounts) {
      const response = await fetchAPI('get', '/api/accounts', null, token)
      setters.setAccounts(response.data)
    }
    if (setters.setCurrencies) {
      const response = await fetchAPI('get', '/api/currencies', null, token)
      setters.setCurrencies(response.data.sort((a, b) => {
        if (a.acronym < b.acronym) {
          return -1
        }
        if (a.acronym > b.acronym) {
          return 1
        }
        return 0
      })
      )
    }
    if (setters.setCategories) {
      const response = await fetchAPI('get', '/api/categories', null, token)
      setters.setCategories(response.data)
    }
    if (setters.setSubcategories) {

      const response = await fetchAPI('get', '/api/subcategories', null, token)
      setters.setSubcategories(response.data)
    }
  } catch (err) {
    return err
  }

}