import apiClient from './client'

// Valid credentials for mocked login (fallback when API is unavailable)
const MOCK_CREDENTIALS = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
}

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/login', {
            email,
            password
        })
        return response.data
    } catch (error) {
        // Fallback to mocked authentication if API fails (e.g., Cloudflare blocks)
        // This follows BRD requirement: "Mocked logic OR Public API"
        console.warn('API unavailable, using mocked authentication')

        if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
            return {
                token: 'QpwL5tke4Pnpja7X4_mock_' + Date.now()
            }
        }

        // Invalid credentials in mock mode
        throw {
            response: {
                data: { error: 'Invalid email or password' }
            }
        }
    }
}

export const registerUser = async (email, password) => {
    const response = await apiClient.post('/register', {
        email,
        password
    })
    return response.data
}
