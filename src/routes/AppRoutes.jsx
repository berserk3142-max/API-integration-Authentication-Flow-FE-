import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import RequireAuth from '../auth/RequireAuth'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import { ROUTES } from '../utils/constants'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route
                        path={ROUTES.DASHBOARD}
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />
                    <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRoutes
