const TOKEN_KEY = 'mahd_admin_token'

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)
export const isLoggedIn = () => !!getToken()
