import axios, { AxiosError } from 'axios'
import { useAuth } from '../stores/auth'
import Config from 'react-native-config'
import { Platform } from 'react-native'

//! Running locally for android doesn't work if we point to 127.0.0.1
const nonSlashEndingUrl = "https://fresh.farmsanta.com"

console.info('connecting to backend with url: ', nonSlashEndingUrl)

export const axiosInstance = axios.create({
  baseURL: `${nonSlashEndingUrl}`,
})

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const { token } = useAuth.getState()
//     console.log("token " +  token)

//     if (token) {
//       const authHeader = `Token ${token}`
//       if (config.headers) {
//         config.headers.Authorization = authHeader
//       } else {
//         const newHeaders = new axios.AxiosHeaders()
//         newHeaders.setAuthorization(authHeader)
//         config.headers = newHeaders
//       }
//     }
//     console.log("config " + JSON.stringify(config))
//     return { ...config }
//   },
//   (error: Error | AxiosError) => {
//     Promise.reject(error)
//   },
// )

// Intercept requests to include authentication tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuth.getState()
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error: AxiosError) => {
//     let errorMessage = ''
//     if (error.response) {
//       // Server responded with a status other than 2xx
//       console.error('API Error:', error.response.data)
//       const responseData = error.response.data
//         errorMessage = JSON.stringify(responseData)
//       if (error.response.status === 401) {
//         // Handle unauthorized access (e.g., token expired)
//         // You might want to log the user out or refresh the token
//       }
//     } else if (error.request) {
//       // No response received from the server
//       console.error('Network Error:', error.message)
//        errorMessage = 'No response received from the server.'
//     } else {
//       // Something happened in setting up the request
//       console.error('Error:', error.message)
//       errorMessage = error.message
//     }
//     return Promise.reject(errorMessage)
//   },
// )

axiosInstance.interceptors.response.use(
  async (config) => {
    if(!config.data?.status){
      if(config.data?.message == "Authtoken is not valid !"){
        useAuth.getState().actions.clearAuth()
      }
    }
    return config
  },
  (err: unknown) => {
    if (
      err instanceof AxiosError &&
      err.response &&
      err.response.data &&
      typeof err.response.data === 'object' &&
      'detail' in err.response.data &&
      err.response.data.detail === 'Invalid token.'
    ) {
      //token has become invalid, clear the store so the app recovers
      useAuth.getState().actions.clearAuth()
    }
    return Promise.reject(err)
  },
)
