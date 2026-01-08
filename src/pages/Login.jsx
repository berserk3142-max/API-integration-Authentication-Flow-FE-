import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import RetryButton from '../components/RetryButton'
import { ROUTES, ERROR_MESSAGES } from '../utils/constants'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || ROUTES.DASHBOARD

    if (isAuthenticated) {
        navigate(from, { replace: true })
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const result = await login(email, password)
            if (result.success) {
                navigate(from, { replace: true })
            } else {
                setError(result.error || ERROR_MESSAGES.LOGIN_FAILED)
            }
        } catch (err) {
            setError(ERROR_MESSAGES.NETWORK_ERROR)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRetry = () => {
        setError(null)
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="login-error-container">
                        <ErrorState
                            title="Login Failed"
                            message={error}
                        />
                        <RetryButton onClick={handleRetry} label="Try Again" />
                    </div>
                )}

                {!error && (
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="eve.holt@reqres.in"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="button-loading">
                                    <span className="button-spinner"></span>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                )}

                <div className="login-footer">
                    <p className="login-hint">
                        Use <strong>eve.holt@reqres.in</strong> with any password
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
