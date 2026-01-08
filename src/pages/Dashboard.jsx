import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { fetchDashboardData } from '../api/dashboard.api'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import RetryButton from '../components/RetryButton'
import { ERROR_MESSAGES } from '../utils/constants'
import './Dashboard.css'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const { logout } = useAuth()

    const loadDashboardData = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetchDashboardData()
            setData(response)
        } catch (err) {
            console.error('Dashboard data fetch error:', err)
            setError(ERROR_MESSAGES.DASHBOARD_LOAD_FAILED)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadDashboardData()
    }, [])

    const handleRetry = () => {
        loadDashboardData()
    }

    const handleLogout = () => {
        logout()
    }

    if (isLoading) {
        return (
            <div className="dashboard-page">
                <Loader message="Loading dashboard data..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <ErrorState
                        title="Unable to Load Data"
                        message={error}
                    />
                    <RetryButton onClick={handleRetry} label="Retry" />
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{data?.total || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Current Page</span>
                        <span className="stat-value">{data?.page || 1}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Per Page</span>
                        <span className="stat-value">{data?.per_page || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total Pages</span>
                        <span className="stat-value">{data?.total_pages || 0}</span>
                    </div>
                </div>

                <section className="users-section">
                    <h2 className="section-title">Team Members</h2>
                    <div className="users-grid">
                        {data?.data?.map((user) => (
                            <div key={user.id} className="user-card">
                                <img
                                    src={user.avatar}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="user-avatar"
                                />
                                <div className="user-info">
                                    <h3 className="user-name">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                    <p className="user-email">{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard
