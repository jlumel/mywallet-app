import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080',
  })

  export const fetchAPI = async (method, url, body) => {
    try {
      const response = await instance[method](url, body)
      return response.data
    } catch (error) {
      return null
    }
  }

  export const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)
  