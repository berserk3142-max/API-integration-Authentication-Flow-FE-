import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Loader from '../components/Loader'
import { ROUTES } from '../utils/constants'

const RequireAuth = ({ children }) => {
    const { isAuthenticated, authLoading } = useAuth()
    const location = useLocation()

    if (authLoading) {
        return <Loader message="Checking authentication..." />
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
    }

    return children
}

export default RequireAuth
