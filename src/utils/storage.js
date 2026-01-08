const TOKEN_KEY = 'auth_token'
const TOKEN_TIMESTAMP_KEY = 'auth_token_timestamp'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString())
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY)
}

export const getTokenTimestamp = () => {
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY)
  return timestamp ? parseInt(timestamp, 10) : null
}
