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
    setIsLogged(true);
    setUsername(response.username)
    return Promise.resolve();

  } catch (error) {
    setIsLogged(false)
    setUsername("")
    return Promise.reject()

  }
}
