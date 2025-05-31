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
export const lowercaseFirstLetter = str => str.charAt(0).toLowerCase() + str.slice(1)

export const formatCurrency = (value, acronym) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: acronym,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

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
    const transactionPromise = setters.setTransactions ? fetchAPI('get', '/api/transactions', null, token) : null
    const accountsPromise = setters.setAccounts ? fetchAPI('get', '/api/accounts', null, token) : null
    const currenciesPromise = setters.setCurrencies ? fetchAPI('get', '/api/currencies', null, token) : null
    const categoriesPromise = setters.setCategories ? fetchAPI('get', '/api/categories', null, token) : null
    const subcategoriesPromise = setters.setSubcategories ? fetchAPI('get', '/api/subcategories', null, token) : null

    const [transactionResponse, accountsResponse, currenciesResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
      transactionPromise,
      accountsPromise,
      currenciesPromise,
      categoriesPromise,
      subcategoriesPromise
    ])

    if (transactionResponse) {
      setters.setTransactions(transactionResponse.data.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1
        }
        if (a.acronym < b.acronym) {
          return 1
        }
        return 0
      }))
    }

    if (accountsResponse) {
      setters.setAccounts(accountsResponse.data)
    }

    if (currenciesResponse) {
      setters.setCurrencies(currenciesResponse.data.sort((a, b) => {
        if (a.acronym < b.acronym) {
          return -1
        }
        if (a.acronym > b.acronym) {
          return 1
        }
        return 0
      }))
    }

    if (categoriesResponse) {
      setters.setCategories(categoriesResponse.data)
    }

    if (subcategoriesResponse) {
      setters.setSubcategories(subcategoriesResponse.data)
    }
  } catch (err) {
    return err
  }
}