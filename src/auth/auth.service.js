import { loginUser } from '../api/auth.api'
import { getToken, setToken, removeToken, getTokenTimestamp } from '../utils/storage'
import { TOKEN_EXPIRY_MINUTES } from '../utils/constants'

export const authenticateUser = async (email, password) => {
    const response = await loginUser(email, password)
    if (response.token) {
        setToken(response.token)
        return { success: true, token: response.token }
    }
    throw new Error('Authentication failed')
}

export const checkTokenValidity = () => {
    const token = getToken()
    if (!token) {
        return false
    }

    const timestamp = getTokenTimestamp()
    if (!timestamp) {
        return false
    }

    const now = Date.now()
    const expiryTime = timestamp + TOKEN_EXPIRY_MINUTES * 60 * 1000

    if (now > expiryTime) {
        removeToken()
        return false
    }

    return true
}

export const clearAuth = () => {
    removeToken()
}

export const getCurrentToken = () => {
    return getToken()
}
