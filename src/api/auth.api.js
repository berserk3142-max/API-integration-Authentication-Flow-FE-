import apiClient from './client'

export const loginUser = async (email, password) => {
    const response = await apiClient.post('/login', {
        email,
        password
    })
    return response.data
}

export const registerUser = async (email, password) => {
    const response = await apiClient.post('/register', {
        email,
        password
    })
    return response.data
}
