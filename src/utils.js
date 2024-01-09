import axios from "axios"

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

    const response = await fetchAPI('get', '/api/user')
    setIsLogged(true)
    setUsername(response.data.username)
    return Promise.resolve()

  } catch (error) {
    setIsLogged(false)
    setUsername("")
    return Promise.reject()

  }
}

export const updateData = async (setters) => {

  try {
    if (setters.setTransactions) {
      const response = await fetchAPI('get', '/api/transactions')
      setters.setTransactions((response.data).reverse())
    }
    if (setters.setAccounts) {
      const response = await fetchAPI('get', '/api/accounts')
      setters.setAccounts(response.data)
    }
    if (setters.setCurrencies) {
      const response = await fetchAPI('get', '/api/currencies')
      setters.setCurrencies(response.data)
    }
    if (setters.setCategories) {
      const response = await fetchAPI('get', '/api/categories')
      setters.setCategories(response.data)
    }
    if (setters.setSubcategories) {

      const response = await fetchAPI('get', '/api/subcategories')
      setters.setSubcategories(response.data)
    }
  } catch (err) {
    return err
  }

}