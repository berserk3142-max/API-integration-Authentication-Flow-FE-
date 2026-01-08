import apiClient from './client'

export const fetchDashboardData = async () => {
    const response = await apiClient.get('/users?page=1')
    return response.data
}

export const fetchUserDetails = async (userId) => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
}
