import axios from 'axios'
import { getToken, removeToken } from '../utils/storage'
import { ROUTES } from '../utils/constants'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

apiClient.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            removeToken()
            window.location.href = ROUTES.LOGIN
        }
        return Promise.reject(error)
    }
)

export default apiClient
