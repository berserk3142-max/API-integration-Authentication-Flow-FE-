import { createContext, useContext, useState, useEffect } from 'react'
import { authenticateUser, checkTokenValidity, clearAuth, getCurrentToken } from './auth.service'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const [authError, setAuthError] = useState(null)

    useEffect(() => {
        const initializeAuth = () => {
            const isValid = checkTokenValidity()
            setIsAuthenticated(isValid)
            setAuthLoading(false)
        }

        initializeAuth()
    }, [])

    const login = async (email, password) => {
        setAuthLoading(true)
        setAuthError(null)

        try {
            await authenticateUser(email, password)
            setIsAuthenticated(true)
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please try again.'
            setAuthError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setAuthLoading(false)
        }
    }

    const logout = () => {
        clearAuth()
        setIsAuthenticated(false)
        setAuthError(null)
    }

    const clearError = () => {
        setAuthError(null)
    }

    const value = {
        isAuthenticated,
        authLoading,
        authError,
        login,
        logout,
        clearError,
        token: getCurrentToken()
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
